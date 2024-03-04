import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import DeleteIcon from '@/assets/icons/delete.svg';
import BotIcon from '@assets/icons/bot.svg';

import styles from '@/app.module.scss';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from '@hello-pangea/dnd';

import { useChatStore } from '@/store/chat';

import Locale from '@/assets/locales';
import { Path } from '@/constant';
import { MaskAvatar } from '@/pages/mask';
import { Mask } from '@/store/mask';
import { usePersonStore } from '@/store/person';

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  id: string;
  index: number;
  narrow?: boolean;
  mask: Mask | undefined;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (props.selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: 'center',
      });
    }
  }, [props.selected]);
  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={`${styles['chat-item']} ${props.selected && styles['chat-item-selected']}`}
          onClick={props.onClick}
          ref={(ele) => {
            draggableRef.current = ele;
            provided.innerRef(ele);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title={`${props.title}\n${Locale.ChatItem.ChatItemCount(props.count)}`}
        >
          {props.narrow ? (
            <div className={styles['chat-item-narrow']}>
              <div className={styles['chat-item-avatar'] + ' no-dark'}>
                <MaskAvatar mask={props.mask} />
              </div>
              <div className={styles['chat-item-narrow-count']}>{props.count}</div>
            </div>
          ) : (
            <>
              <div className={styles['chat-item-title']}>{props.title}</div>
              <div className={styles['chat-item-info']}>
                <div className={styles['chat-item-count']}>{Locale.ChatItem.ChatItemCount(props.count)}</div>
                <div className={styles['chat-item-date']}>{new Date(props.time).toLocaleString()}</div>
              </div>
            </>
          )}

          <div
            className={styles['chat-item-delete']}
            onClick={(e) => {
              e.stopPropagation();
              props.onDelete?.();
            }}
          >
            <DeleteIcon />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function ChatList(props: { narrow?: boolean }) {
  const { token, email } = usePersonStore();
  const [sessions, selectedIndex, selectSession, moveSession, updateSession] = useChatStore((state) => [
    state.sessions,
    state.currentSessionIndex,
    state.selectSession,
    state.moveSession,
    state.updateSession,
  ]);
  const chatStore = useChatStore();
  const navigate = useNavigate();

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    moveSession(source.index, destination.index);
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    updateSession();
  }, []);
  useEffect(() => {
    if (!email) {
      return;
    }
    updateSession();
  }, [email]);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <div className={styles['chat-list']} ref={provided.innerRef} {...provided.droppableProps}>
            {sessions.map((item, i) => {
              const { topic = '新的聊天', mask, messagesCount = 0 } = item;
              const { name = '' } = mask || {};
              const count = item.messages.length === 0 ? messagesCount : item.messages.length;
              const _topic = topic === '' && messagesCount > 0 ? '未总结标题' : topic;
              return (
                <ChatItem
                  title={name ? `${name}:${_topic}` : _topic}
                  time={new Date(item.lastUpdate).toLocaleString()}
                  count={count}
                  key={item.id + i}
                  id={item.id + i}
                  index={i}
                  selected={i === selectedIndex}
                  onClick={() => {
                    navigate(Path.Chat);
                    selectSession(i);
                  }}
                  onDelete={() => {
                    if (!props.narrow || confirm(Locale.Home.DeleteChat)) {
                      chatStore.deleteSession(item.id);
                    }
                  }}
                  narrow={props.narrow}
                  mask={item.mask}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
