import { useSelector } from "react-redux";

export const GlobalLoader = () => {
  const { globalLoader } = useSelector((state) => state.main);
  return (
    <>
      {globalLoader ? (
        <div className="h-full w-full fixed top-0 left-0 bg-black/20 z-[99999]">
          <div className="fixed top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary" />
            <span className="text">{"Loading Please Wait"}</span>
          </div>
        </div>
      ) : null}
    </>
  );
};
