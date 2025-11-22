import Image from 'next/image';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <Image src="/cyclone.png" alt="Loading" width={240} height={240} priority unoptimized />
    </div>
  );
};

export default LoadingScreen;

