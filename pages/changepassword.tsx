import { useRouter } from "next/router";
import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import useTrans from "../hook/useTrans";

const Changepassword = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [password, setPassword] = useState(["", ""]);
   const router = useRouter();
   const trans = useTrans();

   const handleSumbit = async (e) => {
      e.preventDefault();
      try {
         if (password[0] !== password[1]) {
            toast.error("Password dont match! Please check again", {
               position: "top-center",
            });
         } else {
            const resPw = await authAxios().patch(
               endpoints["change_password"](userInfo.id),
               {
                  password: password[0],
                  rePassword: password[1],
               }
            );
            toast.success("Change password successful", {
               position: "top-center",
            });
            router.push("/profile");
         }
      } catch (error) {
         console.log(error);
      }
   };
   return (
      <Layout title="Change Password">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
               onClick={() => router.push("/profile")}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">
               / {trans.profile.password.title}
            </div>
         </div>
         <form
            className="grid grid-cols-12 gap-4 mx-[24rem] text-left font-medium"
            onSubmit={handleSumbit}
         >
            <div className="col-span-12">
               <label htmlFor="newPassword" className="">
                  {trans.profile.password.new_password}
               </label>
               <input
                  type="password"
                  id="newPassword"
                  autoComplete="on"
                  required
                  className="p-4 rounded-lg w-full bg-light-primary dark:bg-dark-primary"
                  onChange={(e) => {
                     setPassword([e.target.value, password[1]]);
                  }}
               />
            </div>
            <div className="col-span-12">
               <label htmlFor="ConfirmNewPassword" className="">
                  {trans.profile.password.confirm_new_password}
               </label>
               <input
                  type="password"
                  required
                  id="ConfirmNewPassword"
                  autoComplete="on"
                  className="p-4 rounded-lg w-full bg-light-primary dark:bg-dark-primary"
                  onChange={(e) => {
                     setPassword([password[0], e.target.value]);
                  }}
               />
            </div>
            <div className="col-span-12">
               <button
                  className="px-4 py-3 bg-primary-color text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-color transition-all"
                  type="submit"
               >
                  {trans.profile.password.submit}
               </button>
            </div>
         </form>
         <Toaster />
      </Layout>
   );
};

export default Changepassword;
