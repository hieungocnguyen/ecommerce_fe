/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
   BiArrowBack,
   BiEditAlt,
   BiLockAlt,
   BiMap,
   BiPhone,
} from "react-icons/bi";
import API, { endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import useTrans from "../hook/useTrans";

const Profile = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [user, setUser] = useState<any>({});
   const [waitAccept, setWaitAccept] = useState<boolean>(false);
   const [authProvider, setAuthProvider] = useState<number>(0);
   const router = useRouter();
   const trans = useTrans();

   const loadUser = async () => {
      try {
         const resUser = await API.get(endpoints["user"](userInfo.id));
         setUser(resUser.data.data);
         setAuthProvider(resUser.data.data.authProvider.id);
      } catch (error) {
         console.log(error);
      }
   };
   const loadInfoAgency = async () => {
      try {
         const resAgency = await API.get(
            endpoints["get_agency_info_by_userID"](userInfo.id)
         );
         if (resAgency.data.data != null) {
            Cookies.set("agencyInfo", JSON.stringify(resAgency.data.data));
            dispatch({ type: "AGENCY_INFO_SET", payload: resAgency.data.data });
            if (resAgency.data.data.isCensored === 0) {
               setWaitAccept(true);
            }
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (userInfo) {
         loadUser();
         loadInfoAgency();
      }
   }, [userInfo]);

   return (
      <Layout title="Profile User">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
               onClick={() => router.push("/")}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">
               / {trans.profile.title}
            </div>
         </div>
         <div className="">
            <div className="relative bg-primary-color h-36 rounded-lg">
               <div className="relative overflow-hidden h-48 aspect-square rounded-full left-24 -bottom-12 border-8 border-dark-text dark:border-dark-bg">
                  <Image
                     src={user.avatar}
                     alt="avatar"
                     layout="fill"
                     className="object-cover"
                  />
               </div>
               <div className="absolute -bottom-20 left-[19rem]  text-left">
                  <div
                     className={`font-semibold text-3xl ${
                        user.firstName || user.lastName ? "" : "text-orange-500"
                     }`}
                  >
                     {user.firstName || user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : trans.profile.unnamed}
                  </div>
                  <div className="font-medium opacity-80">{user.email}</div>
               </div>
               <div className="absolute right-6 bottom-6 flex gap-4">
                  <Link href="/editprofile">
                     <button
                        title="Edit your information"
                        type="button"
                        className="px-4 py-3 border-dark-text border-2 rounded-lg text-white font-semibold hover:bg-dark-text hover:text-primary-color transition-all flex items-center"
                     >
                        <BiEditAlt className="text-2xl inline-block mr-2" />
                        <span>{trans.profile.change_info}</span>
                     </button>
                  </Link>
                  {authProvider == 1 ? (
                     <>
                        <Link href="/changepassword">
                           <button
                              title="Change Password"
                              type="button"
                              className="px-4 py-3 border-dark-text border-2 rounded-lg text-white font-semibold hover:bg-dark-text hover:text-primary-color transition-all flex items-center"
                           >
                              <BiLockAlt className="text-2xl inline-block mr-2" />
                              <span>{trans.profile.change_password}</span>
                           </button>
                        </Link>
                     </>
                  ) : (
                     <></>
                  )}
               </div>
            </div>
            <div className="grid grid-cols-12 gap-4 mt-32 mx-8">
               <div className="col-span-6 rounded-lg border-primary-color border-2 text-left p-4 items-center">
                  <div className="flex items-center gap-4 mb-1">
                     <BiPhone className="text-2xl" />
                     <div
                        className={`text-lg font-medium ${
                           user.phone ? "" : "text-orange-500"
                        }`}
                     >
                        {user.phone ? user.phone : trans.profile.not_provided}
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <BiMap className="text-2xl" />
                     <div
                        className={`text-lg font-medium ${
                           user.address ? "" : "text-orange-500"
                        }`}
                     >
                        {user.address
                           ? user.address
                           : trans.profile.not_provided}
                     </div>
                  </div>
               </div>
               {user && (
                  <div className="col-span-6 border-primary-color border-2 rounded-lg p-4 items-center flex justify-center ">
                     {user.role && user.role.id === 3 ? (
                        waitAccept ? (
                           <div className="font-medium">
                              {trans.profile.wait_accept}
                           </div>
                        ) : (
                           <div>
                              <Link href="/registerAgency">
                                 <button
                                    title="Register Merchant"
                                    type="button"
                                    className="rounded-xl px-4 py-3 bg-primary-color text-white font-semibold hover:shadow-lg hover:shadow-primary-color"
                                 >
                                    {trans.profile.register_merchant}
                                 </button>
                              </Link>
                           </div>
                        )
                     ) : agencyInfo && agencyInfo.isActive === 1 ? (
                        <>
                           <div
                              className={`flex items-center justify-center font-medium`}
                           >
                              {trans.profile.can_manage}
                           </div>
                        </>
                     ) : user.role && user.role.id === 1 ? (
                        <div className="flex items-center justify-center font-semibold text-primary-color text-xl">
                           {trans.profile.admin}
                        </div>
                     ) : (
                        <div
                           className={`flex items-center justify-center font-semibold text-red-600 text-xl`}
                        >
                           {trans.profile.has_banned}
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>
      </Layout>
   );
};
export default dynamic(() => Promise.resolve(Profile), { ssr: false });
