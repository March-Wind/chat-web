import React, { useState } from 'react';
import { IconButton } from '@/components/common/button';
// import { ErrorBoundary } from "./error";

import styles from './mask.module.scss';
import { SaveOutlined } from '@ant-design/icons';
import DownloadIcon from '@/assets/icons/download.svg';
import UploadIcon from '@/assets/icons/upload.svg';
import EditIcon from '@/assets/icons/edit.svg';
import AddIcon from '@/assets/icons/add.svg';
import CloseIcon from '@/assets/icons/close.svg';
import DeleteIcon from '@/assets/icons/delete.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import CopyIcon from '@/assets/icons/copy.svg';

import { DEFAULT_MASK_AVATAR, Mask, useMaskStore } from '@/store/mask';
import { ChatMessage, useChatStore } from '@/store/chat';
import { ModelConfig } from '@/store/config';
import { ROLES, Updater } from '@/types';
import { Input, List, ListItem, Modal, Popover, Select } from '@/components/common/ui-lib/ui-lib';
import { Avatar, AvatarPicker } from '@/components/common/emoji';
import Locale, { AllLangs, Lang } from '@/assets/locales';
import { useNavigate } from 'react-router-dom';

import chatStyle from '@/pages/chat/chat.module.scss';
import { downloadAs, readFromFile } from '@/tools/utils';
import { ModelConfigList } from './model-config';
import { FileName, Path } from '@/constant';
import { BUILTIN_MASK_STORE } from '@/assets/masks';

export function MaskAvatar(props: { mask: Mask | undefined }) {
  return props?.mask?.avatar && props?.mask?.avatar !== DEFAULT_MASK_AVATAR ? (
    <Avatar avatar={props?.mask?.avatar} />
  ) : (
    // <Avatar model={props.mask.modelConfig.model} />
    <Avatar model="gpt-4" />
  );
}

const MaskIcon = ({ mask }: { mask?: Mask }) => {
  return mask?.avatar ? (
    <img className={styles['mask-icon']} src={mask.avatar} alt="" />
  ) : (
    <Avatar className={styles['mask-icon']} model="gpt-4" />
  );
};

export function MaskConfig(props: {
  mask: Mask;
  updateMask: Updater<Mask>;
  extraListItems?: JSX.Element;
  readonly?: boolean;
}) {
  const [showPicker, setShowPicker] = useState(false);

  const updateConfig = (updater: (config: ModelConfig) => void) => {
    if (props.readonly) return;

    const config = { ...props.mask.modelConfig };
    updater(config);
    props.updateMask((mask) => (mask.modelConfig = config));
  };
  const { mask } = props;
  const { context = [] } = mask;

  const { readonly } = props;
  return (
    <>
      <ContextPrompts
        context={context}
        readonly={readonly}
        updateContext={(updater) => {
          const _context = context.slice();
          updater(_context);
          props.updateMask((mask) => (mask.context = _context));
        }}
      />

      <List>
        <ListItem title={Locale.Mask.Config.Avatar}>
          {/* <Popover
            content={
              <AvatarPicker
                onEmojiClick={(emoji) => {
                  props.updateMask((mask) => (mask.avatar = emoji));
                  setShowPicker(false);
                }}
              ></AvatarPicker>
            }
            open={showPicker}
            onClose={() => setShowPicker(false)}
          > */}
          <div onClick={() => setShowPicker(true)} style={{ cursor: 'pointer' }}>
            <MaskAvatar mask={props.mask} />
          </div>
          {/* </Popover> */}
        </ListItem>
        <ListItem title={Locale.Mask.Config.Name}>
          <input
            className="custom_input"
            type="text"
            value={props.mask.name}
            readOnly={readonly}
            onInput={readonly ? undefined : (e) => props.updateMask((mask) => (mask.name = e.currentTarget.value))}
          ></input>
        </ListItem>
      </List>
      <List>
        <ModelConfigList modelConfig={{ ...props.mask.modelConfig }} updateConfig={updateConfig} />
        {props.extraListItems}
      </List>
    </>
  );
}

function ContextPromptItem(props: { prompt: ChatMessage; update: (prompt: ChatMessage) => void; remove: () => void }) {
  const [focusingInput, setFocusingInput] = useState(false);

  return (
    <div className={chatStyle['context-prompt-row']}>
      {!focusingInput && (
        <Select
          value={props.prompt.role}
          className={chatStyle['context-role']}
          onChange={(e) =>
            props.update({
              ...props.prompt,
              role: e.target.value as any,
            })
          }
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      )}
      <Input
        value={props.prompt.content}
        type="text"
        className={chatStyle['context-content'] + ' custom_input'}
        rows={focusingInput ? 5 : 1}
        onFocus={() => setFocusingInput(true)}
        onBlur={() => setFocusingInput(false)}
        onInput={(e) =>
          props.update({
            ...props.prompt,
            content: e.currentTarget.value as any,
          })
        }
      />
      {!focusingInput && (
        <IconButton
          icon={<DeleteIcon />}
          className={chatStyle['context-delete-button']}
          onClick={() => props.remove()}
          bordered
        />
      )}
    </div>
  );
}

export function ContextPrompts(props: {
  context: ChatMessage[];
  updateContext: (updater: (context: ChatMessage[]) => void) => void;
  readonly?: boolean;
}) {
  const context = props.context;
  const { readonly } = props;
  const addContextPrompt = (prompt: ChatMessage) => {
    props.updateContext((context) => context.push(prompt));
  };

  const removeContextPrompt = (i: number) => {
    props.updateContext((context) => context.splice(i, 1));
  };

  const updateContextPrompt = (i: number, prompt: ChatMessage) => {
    props.updateContext((context) => (context[i] = prompt));
  };

  return (
    <>
      <div className={chatStyle['context-prompt']} style={{ marginBottom: 20 }}>
        {context.map((c, i) => (
          <ContextPromptItem
            key={i}
            prompt={c}
            update={(prompt) => updateContextPrompt(i, prompt)}
            remove={() => removeContextPrompt(i)}
          />
        ))}

        <div className={chatStyle['context-prompt-row']}>
          <IconButton
            disabled={readonly}
            icon={<AddIcon />}
            text={Locale.Context.Add}
            bordered
            className={chatStyle['context-prompt-button']}
            onClick={() =>
              addContextPrompt({
                role: 'user',
                content: '',
                date: '',
              })
            }
          />
        </div>
      </div>
    </>
  );
}

function MaskPage() {
  const navigate = useNavigate();

  const maskStore = useMaskStore();
  const chatStore = useChatStore();

  const [filterLang, setFilterLang] = useState<Lang>();

  const allMasks = maskStore.getAll().filter((m) => !filterLang || m.lang === filterLang);

  const [searchMasks, setSearchMasks] = useState<Mask[]>([]);
  const [searchText, setSearchText] = useState('');
  const masks = searchText.length > 0 ? searchMasks : allMasks;

  // simple search, will refactor later
  const onSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      const result = allMasks.filter((m) => m.name.includes(text));
      setSearchMasks(result);
    } else {
      setSearchMasks(allMasks);
    }
  };

  const [editingMaskId, setEditingMaskId] = useState<string | undefined>();
  const editingMask = editingMaskId ? maskStore.get(editingMaskId) : undefined;
  const closeMaskModal = () => setEditingMaskId(undefined);

  const downloadAll = () => {
    downloadAs(JSON.stringify(masks), FileName.Masks);
  };

  const importFromFile = () => {
    readFromFile().then((content) => {
      try {
        const importMasks = JSON.parse(content);
        if (Array.isArray(importMasks)) {
          for (const mask of importMasks) {
            if (mask.name) {
              maskStore.create(mask);
            }
          }
        }
      } catch {
        console.log('importFromFile');
      }
    });
  };

  return (
    <>
      <div className={styles['mask-page']}>
        <div className="window-header">
          <div className="window-header-title">
            <div className="window-header-main-title">{Locale.Mask.Page.Title}</div>
            <div className="window-header-submai-title">{Locale.Mask.Page.SubTitle(allMasks.length)}</div>
          </div>

          <div className="window-actions">
            <div className="window-action-button">
              <IconButton icon={<DownloadIcon />} bordered onClick={downloadAll} />
            </div>
            <div className="window-action-button">
              <IconButton icon={<UploadIcon />} bordered onClick={() => importFromFile()} />
            </div>
            <div className="window-action-button">
              <IconButton icon={<CloseIcon />} bordered onClick={() => navigate(-1)} />
            </div>
          </div>
        </div>

        <div className={styles['mask-page-body']}>
          <div className={styles['mask-filter']}>
            <input
              type="text"
              className={styles['search-bar'] + ' custom_input'}
              placeholder={Locale.Mask.Page.Search}
              autoFocus
              onInput={(e) => onSearch(e.currentTarget.value)}
            />
            {/* <Select
              className={styles['mask-filter-lang']}
              value={filterLang ?? Locale.Settings.Lang.All}
              onChange={(e) => {
                const value = e.currentTarget.value;
                if (value === Locale.Settings.Lang.All) {
                  setFilterLang(undefined);
                } else {
                  setFilterLang(value as Lang);
                }
              }}
            >
              <option key="all" value={Locale.Settings.Lang.All}>
                {Locale.Settings.Lang.All}
              </option>
              {AllLangs.map((lang) => (
                <option value={lang} key={lang}>
                  {Locale.Settings.Lang.Options[lang]}
                </option>
              ))}
            </Select> */}

            <IconButton
              className={styles['mask-create']}
              icon={<AddIcon />}
              text={Locale.Mask.Page.Create}
              bordered
              onClick={() => {
                const createdMask = maskStore.create();
                setEditingMaskId(createdMask.id);
              }}
            />
          </div>

          <div>
            {masks.map((m, i) => {
              let typeTip: string;
              switch (m.type) {
                case 'system':
                  typeTip = '系统设置';
                  break;
                case 'user':
                  typeTip = '用户设置';
                  break;
                case 'base':
                default:
                  typeTip = '基础预设';
                  break;
              }
              return (
                <div className={styles['mask-item']} key={m.id + i}>
                  <div className={styles['mask-header']}>
                    <div className={styles['mask-icon-box']}>
                      <MaskIcon mask={m} />
                    </div>
                    <div className={styles['mask-title']}>
                      <div className={styles['mask-name']}>{m.name}</div>
                      <div className={styles['mask-info'] + ' one-line'}>{typeTip}</div>
                    </div>
                  </div>
                  <div className={styles['mask-actions']}>
                    <IconButton
                      icon={<AddIcon />}
                      text={Locale.Mask.Item.Chat}
                      onClick={() => {
                        chatStore.newSession(m);
                        navigate(Path.Chat);
                      }}
                    />
                    {m.type === 'system' ? (
                      <IconButton
                        icon={<EyeIcon />}
                        text={Locale.Mask.Item.View}
                        onClick={() => setEditingMaskId(m.id)}
                      />
                    ) : (
                      <IconButton
                        icon={<EditIcon />}
                        text={Locale.Mask.Item.Edit}
                        onClick={() => setEditingMaskId(m.id)}
                      />
                    )}
                    {m.type === 'user' && (
                      <IconButton
                        icon={<DeleteIcon />}
                        text={Locale.Mask.Item.Delete}
                        onClick={() => {
                          if (confirm(Locale.Mask.Item.DeleteConfirm)) {
                            maskStore.delete(m.id);
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {editingMask && (
        <div className="modal-mask">
          <Modal
            title={Locale.Mask.EditModal.Title(editingMask?.type !== 'user')}
            onClose={closeMaskModal}
            actions={
              editingMask?.type === 'user'
                ? [
                    <IconButton
                      icon={<SaveOutlined />}
                      text={Locale.Mask.EditModal.Save}
                      key="export"
                      bordered
                      onClick={() => {
                        maskStore.save(editingMask.id);
                      }}
                    />,
                    <IconButton
                      key="copy"
                      icon={<CopyIcon />}
                      bordered
                      text={Locale.Mask.EditModal.Clone}
                      onClick={() => {
                        navigate(Path.Masks);
                        maskStore.create(editingMask);
                        setEditingMaskId(undefined);
                      }}
                    />,
                  ]
                : []
            }
          >
            <MaskConfig
              mask={editingMask}
              updateMask={(updater) => maskStore.update(editingMaskId!, updater)}
              readonly={editingMask?.type !== 'user'}
            />
          </Modal>
        </div>
      )}
    </>
  );
}
export default MaskPage;
