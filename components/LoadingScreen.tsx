import Image from 'next/image';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <Image src="/cyclone.png" alt="Loading" width={240} height={240} className="sm:w-60 w-40 animate-spin" priority />
    </div>
  );
};

export default LoadingScreen;

