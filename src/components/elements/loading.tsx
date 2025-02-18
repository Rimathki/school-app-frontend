import React from 'react';
import Image from 'next/image';

type Props = {
  height?: number;
  width?: number;
};
const Loading = ({width, height}: Props) => {
  return (
    <div className='w-full h-full flex justify-center items-center bg-white'>
      <Image width={width} height={height} src='/loader.gif' alt='loader' priority unoptimized />
    </div>
  );
};

export default Loading;
