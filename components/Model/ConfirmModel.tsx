import { useRouter } from "next/router";

const ConfirmModel = ({
   functionConfirm,
   content,
   isOpenConfirm,
   setIsOpenConfirm,
}) => {
   const { locale } = useRouter();
   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg w-full h-full relative p-8 shadow-lg border-2 border-primary-color">
         <div className="font-semibold text-lg text-center mb-4">{content}</div>
         <div className="flex justify-center gap-8 items-center">
            <button
               onClick={() => {
                  functionConfirm();
                  setIsOpenConfirm(false);
               }}
               className="px-4 py-3 bg-primary-color rounded-lg hover:shadow-lg hover:shadow-primary-color text-white font-semibold"
            >
               {locale == "vi" ? "Tiếp tục" : "Yes"}
            </button>
            <button
               onClick={() => setIsOpenConfirm(false)}
               className="px-4 py-3 bg-red-500 rounded-lg hover:shadow-lg hover:shadow-red-500 text-white font-semibold"
            >
               {locale == "vi" ? "Huỷ" : "No"}
            </button>
         </div>
      </div>
   );
};

export default ConfirmModel;
