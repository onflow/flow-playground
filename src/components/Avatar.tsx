import React from 'react';
import { mb32 } from 'util/rng';

interface AvatarProps {
  seed: number;
  index: number;
  style?: any;
}

const Avatar: React.FC<AvatarProps> = ({ seed, index, style }) => {
  const rng = mb32(seed);

  for (var i = 0; i < index; i++) {
    rng();
  }

  const profile = `0x0${index + 1}.svg`
  return (
    <img
      className="avatar"
      src={profile}
      style={style}
      alt="Avatar"
    />
  );
};

export default Avatar;
