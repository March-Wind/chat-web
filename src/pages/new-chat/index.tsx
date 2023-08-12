import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Path, SlotID } from '@/constant';
import { IconButton } from '@/components/common/button';
import { EmojiAvatar } from '@/components/common/emoji';
import styles from './new-chat.module.scss';

import LeftIcon from '@/assets/icons/left.svg';
import LightningIcon from '@/assets/icons/lightning.svg';
import EyeIcon from '@/assets/icons/eye.svg';

import { Mask, useMaskStore } from '@/store/mask';
import Locale from '@/assets/locales';
import { useChatStore } from '@/store/chat';
import { useAppConfig } from '@/store/config';
import { MaskAvatar } from '@/pages/mask';
import useCommand from '@/hooks/useCommand';
import { use } from 'cytoscape';

function getIntersectionArea(aRect: DOMRect, bRect: DOMRect) {
  const xmin = Math.max(aRect.x, bRect.x);
  const xmax = Math.min(aRect.x + aRect.width, bRect.x + bRect.width);
  const ymin = Math.max(aRect.y, bRect.y);
  const ymax = Math.min(aRect.y + aRect.height, bRect.y + bRect.height);
  const width = xmax - xmin;
  const height = ymax - ymin;
  const intersectionArea = width < 0 || height < 0 ? 0 : width * height;
  return intersectionArea;
}

function MaskItem(props: { mask: Mask; onClick?: () => void }) {
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const changeOpacity = () => {
      const dom = domRef.current;
      const parent = document.getElementById(SlotID.AppBody);
      if (!parent || !dom) return;

      const domRect = dom.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const intersectionArea = getIntersectionArea(domRect, parentRect);
      const domArea = domRect.width * domRect.height;
      const ratio = intersectionArea / domArea;
      const opacity = ratio > 0.9 ? 1 : 0.4;
      dom.style.opacity = opacity.toString();
    };

    setTimeout(changeOpacity, 30);

    window.addEventListener('resize', changeOpacity);

    return () => window.removeEventListener('resize', changeOpacity);
  }, [domRef]);
  return (
    <div className={styles['mask']} ref={domRef} onClick={props.onClick}>
      <MaskAvatar mask={props.mask} />
      <div className={styles['mask-name'] + ' one-line'}>{props.mask.name}</div>
    </div>
  );
}

function NewChat() {
  const chatStore = useChatStore();
  const maskStore = useMaskStore();

  const masks = maskStore.masks;
  console.log(111, masks);
  const navigate = useNavigate();
  const config = useAppConfig();

  const { state } = useLocation();

  const startChat = (mask?: Mask) => {
    chatStore.newSession(mask);
    setTimeout(() => navigate(Path.Chat), 1);
  };

  useCommand({
    mask: (id) => {
      try {
        const mask = maskStore.get(parseInt(id));
        startChat(mask ?? undefined);
      } catch {
        console.error('[New Chat] failed to create chat from mask id=', id);
      }
    },
  });

  useEffect(() => {
    maskStore.queryPrompts();
  }, []);

  return (
    <div className={styles['new-chat']}>
      <div className={styles['mask-header']}>
        {/* 返回 */}
        <IconButton icon={<LeftIcon />} text={Locale.NewChat.Return} onClick={() => navigate(Path.Home)}></IconButton>

        {!state?.fromHome && (
          <IconButton
            text={Locale.NewChat.NotShow}
            onClick={() => {
              if (confirm(Locale.NewChat.ConfirmNoShow)) {
                startChat();
                config.update((config) => (config.dontShowMaskSplashScreen = true));
              }
            }}
          ></IconButton>
        )}
      </div>
      <div className={styles['mask-cards']}>
        <div className={styles['mask-card']}>
          <EmojiAvatar avatar="1f606" size={24} />
        </div>
        <div className={styles['mask-card']}>
          <EmojiAvatar avatar="1f916" size={24} />
        </div>
        <div className={styles['mask-card']}>
          <EmojiAvatar avatar="1f479" size={24} />
        </div>
      </div>

      <div className={styles['title']}>{Locale.NewChat.Title}</div>
      <div className={styles['sub-title']}>{Locale.NewChat.SubTitle}</div>

      <div className={styles['actions']}>
        <IconButton
          text={Locale.NewChat.Skip}
          onClick={() => startChat()}
          icon={<LightningIcon />}
          type="primary"
          shadow
        />

        <IconButton
          className={styles['more']}
          text={Locale.NewChat.More}
          onClick={() => navigate(Path.Masks)}
          icon={<EyeIcon />}
          bordered
          shadow
        />
      </div>

      <div className={styles['masks']}>
        {/* {groups.map((masks, i) => (
          <div key={i} className={styles['mask-row']}>
            {masks.map((mask, index) => (
              <MaskItem key={index} mask={mask} onClick={() => startChat(mask)} />
            ))}
          </div>
        ))} */}
        <div className={styles['masks-wrap']}>
          {masks.map((mask, index) => {
            return <MaskItem key={index} mask={mask} onClick={() => startChat(mask)} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default NewChat;
