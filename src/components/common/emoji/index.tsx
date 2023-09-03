import React from 'react';
import EmojiPicker, { Emoji, EmojiStyle, Theme as EmojiTheme } from 'emoji-picker-react';

import { ModelType } from '@/store/config';

import BotIcon from '@/assets/icons/bot.svg';
import BlackBotIcon from '@/assets/icons/black-bot.svg';
import { usePersonStore } from '@/store/person';
import styles from './index.module.scss';
export function getEmojiUrl(unified: string, style: EmojiStyle) {
  return `https://cdn.staticfile.org/emoji-datasource-apple/14.0.0/img/${style}/64/${unified}.png`;
}
// to optimize
export function AvatarPicker(props: { onEmojiClick: (emojiId: string) => void }) {
  return (
    <EmojiPicker
      lazyLoadEmojis
      theme={EmojiTheme.AUTO}
      getEmojiUrl={getEmojiUrl}
      onEmojiClick={(e) => {
        props.onEmojiClick(e.unified);
      }}
    />
  );
}

export function Avatar(props: { model?: ModelType; avatar?: string; className?: string }) {
  const {
    name: { firstName, lastName },
  } = usePersonStore();
  const { className = 'user-avatar' } = props;
  if (props.model) {
    return (
      <div className="no-dark">
        {props.model?.startsWith('gpt-4') ? <BlackBotIcon className={className} /> : <BotIcon className={className} />}
      </div>
    );
  }

  return <div className="user-avatar">{props.avatar && <EmojiAvatar avatar={props.avatar} />}</div>;
}

export function EmojiAvatar(props: { avatar: string; size?: number }) {
  return <Emoji unified={props.avatar} size={props.size ?? 18} getEmojiUrl={getEmojiUrl} />;
}
