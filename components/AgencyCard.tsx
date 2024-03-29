import { AiFillHeart } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { authAxios, endpoints } from "../API";
import { Store } from "../utils/Store";
import { BiUserPlus, BiUserX } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const AgencyCard = ({ agency, likeNumber }) => {
   const [stateFollow, setStateFollow] = useState(false);
   const { state } = useContext(Store);
   const { userInfo } = state;
   const { locale } = useRouter();

   const fetchFollowState = async () => {
      try {
         const res = await authAxios().get(
            endpoints["get_state_follow_agency"](agency.id)
         );
         setStateFollow(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (userInfo) {
         fetchFollowState();
      }
   }, []);

   const handleFollowAgency = async () => {
      if (userInfo) {
         try {
            const res = await authAxios().get(
               endpoints["follow_agency"](agency.id)
            );
            fetchFollowState();
            stateFollow
               ? toast.success("Unfollow merchant successful!")
               : toast.success("Follow merchant successful!");
         } catch (error) {
            console.log(error);
            toast.error("Something wrong, please try again!");
         }
      } else {
         toast.error("Please log in to follow merchant!");
      }
   };
   return (
      <>
         <Link href={`/agencyinfo/${agency.id}`}>
            <div className="dark:bg-dark-primary bg-light-primary rounded-lg overflow-hidden p-6 cursor-pointer hover:shadow-lg relative">
               <div>
                  <div className="relative">
                     <div className="w-full aspect-square relative overflow-hidden rounded-2xl hover:scale-105 transition-all">
                        <Image
                           src={agency.avatar}
                           alt="avatar"
                           layout="fill"
                           className="object-cover hover:shadow-lg"
                        />
                     </div>
                     {likeNumber && (
                        <div className="absolute -left-4 -bottom-4 rounded-tr-xl pt-2 pb-4 pl-5 pr-3 font-semibold uppercase bg-light-primary dark:bg-dark-primary dark:text-dark-text text-light-text text-xl z-10 flex items-center justify-center">
                           <div>{likeNumber}</div>
                           <AiFillHeart className="text-xl" />
                        </div>
                     )}
                  </div>
                  <div className="text-center font-bold text-xl uppercase mt-4 text-primary-color h-14 flex items-center justify-center">
                     {agency.name}
                  </div>
                  <div className="text-center font-semibold">
                     {locale == "vi" ? agency.field.name : agency.field.nameEn}
                  </div>
               </div>
               <div className="absolute top-0 right-0 bg-light-primary dark:bg-dark-primary rounded-bl-lg">
                  <div className="w-14 h-14 flex justify-center items-center">
                     {stateFollow ? (
                        <button
                           title="Unfollow this merchant"
                           onClick={(event) => {
                              event.stopPropagation();
                              handleFollowAgency();
                           }}
                        >
                           <BiUserX className="text-3xl text-red-500 hover:text-4xl transition-all" />
                        </button>
                     ) : (
                        <button
                           title="Follow this merchant"
                           onClick={(event) => {
                              event.stopPropagation();
                              handleFollowAgency();
                           }}
                        >
                           <BiUserPlus className="text-3xl text-green-500 hover:text-4xl transition-all" />
                        </button>
                     )}
                  </div>
               </div>
            </div>
         </Link>
      </>
   );
};

export default AgencyCard;
