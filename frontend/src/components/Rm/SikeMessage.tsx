import React from 'react';
import './SikeMessage.css';

/*
 * What shows up where the removed thing used to be, before it comes back.
 *
 * This is the only file to touch to change the gag: swap the text for an <img>, a gif, a random
 * pick, whatever. It's rendered centred over the visible part of each removed element.
 *   target - the rm key that was removed ("project:age", "page", "everything", ...)
 *   width/height - size of the space it's drawn in, for scaling
 */
type SikeMessageProps = {
  target: string;
  width: number;
  height: number;
};

const SikeMessage: React.FC<SikeMessageProps> = ({ width, height }) => {
  const size = Math.max(18, Math.min(140, Math.min(width / 3.2, height * 0.6)));
  return <span className="sike-text" style={{ fontSize: size }}>SIKE</span>;
};

export default SikeMessage;
