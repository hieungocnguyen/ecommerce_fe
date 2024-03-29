/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import Layout from "./Layout/Layout";
import { HiOutlineShoppingCart } from "react-icons/hi";
import Link from "next/link";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { authAxios, endpoints } from "../API";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import moment from "moment";
import { BiCartAlt, BiGitCompare, BiShowAlt, BiUndo } from "react-icons/bi";
import { Store } from "../utils/Store";
import toast, { Toaster } from "react-hot-toast";
import QuickView from "./Model/QuickView";
import ItemsInPost from "./Model/ItemsInPost";
import Loading from "./Loading";

const ProductItem = ({ product, inCompare }) => {
   const [stateLike, setStateLike] = useState(false);
   const router = useRouter();
   const { locale } = useRouter();
   const { state, dispatch } = useContext(Store);
   const { compare, userInfo } = state;
   const [isOpenQuickViewModal, setIsOpenQuickViewModal] = useState(false);
   const [isOpenItemsModal, setIsOpenItemsModal] = useState(false);

   const handleAddToWishList = async () => {
      if (!Cookies.get("accessToken")) {
         // router.push("/signin");
         toast.error("You must sign in to add to wishlist!", {
            position: "top-center",
         });
      } else {
         try {
            const resAdd = await authAxios().get(
               endpoints["like_post"](product.id)
            );
            toast.success("Add to wishlist successful!", {
               position: "top-center",
            });
            loadLikeStatus();
         } catch (error) {
            console.log(error);
            toast.error("Something wrong, try it later!", {
               position: "top-center",
            });
         }
      }
   };

   const handleRemoveToWishList = async () => {
      try {
         const resRemove = await authAxios().get(
            endpoints["like_post"](product.id)
         );
         toast.success("Remove from wishlist successful!", {
            position: "top-center",
         });
         loadLikeStatus();
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, please try again!");
      }
   };

   const handleAddCompare = () => {
      if (compare.products.length == 2) {
         toast.error("Max number item is 2");
      } else {
         dispatch({
            type: "COMPARE_ADD_PRODUCT",
            payload: {
               id: product.id,
               avatar: product.avatar,
               title: product.title,
               finalPrice: product.finalPrice,
               initialPrice: product.initialPrice,
               sellStatus: product.sellStatus,
               agency: { isActive: product.agency.isActive },
            },
         });
         toast.success(`Add to compare successful!`, {
            position: "top-center",
         });
      }
   };

   const handleRemoveCompare = () => {
      dispatch({
         type: "COMPARE_REMOVE_PRODUCT",
         payload: {
            id: product.id,
         },
      });
      toast.success(`Remove compare successful!`, {
         position: "top-center",
      });
   };

   const loadLikeStatus = async () => {
      try {
         const resStatus = await authAxios().get(
            endpoints["check_like"](product.id)
         );
         setStateLike(resStatus.data.data);
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, try it later!", {
            position: "top-center",
         });
      }
   };

   const handleDetailRoute = () => {
      router.push(`/sale_post/${product.id}`);
   };

   useEffect(() => {
      if (Cookies.get("accessToken")) {
         loadLikeStatus();
      }
      setStateLike(false);
   }, []);

   return (
      <div className="relative">
         <div
            className="dark:bg-dark-primary bg-light-primary rounded-lg p-6 cursor-pointer hover:shadow-lg"
            onClick={() => handleDetailRoute()}
         >
            <div className="relative">
               <div className="w-full aspect-square relative overflow-hidden rounded-2xl hover:scale-105 transition-all">
                  <Image
                     src={product.avatar}
                     alt="avt"
                     layout="fill"
                     className="object-cover"
                  />
               </div>
               <div className="absolute -left-4 -bottom-4 rounded-tr-lg p-2 pl-4 pb-4 font-bold uppercase bg-light-primary dark:bg-dark-primary text-primary-color z-10">
                  <div className="bg-secondary-color py-1 px-2 rounded-xl text-dark-primary">
                     {locale == "vi"
                        ? product.sellStatus.nameVi
                        : product.sellStatus.name}
                  </div>
               </div>
            </div>
            <div className="text-left font-bold text-xl uppercase mt-4 mb-2 line-clamp-2 h-14">
               {product.title}
            </div>
            <div className="text-left">
               <div className="text-2xl font-bold text-primary-color">
                  {product.finalPrice.toLocaleString("it-IT", {
                     style: "currency",
                     currency: "VND",
                  })}
               </div>
               <div className="line-through">
                  {product.initialPrice.toLocaleString("it-IT", {
                     style: "currency",
                     currency: "VND",
                  })}
               </div>
            </div>

            <div className="flex gap-4 mt-4">
               <button
                  className="w-24 h-14 rounded-2xl flex justify-center items-center text-light-text bg-secondary-color hover:shadow-secondary-color hover:shadow-lg hover:brightness-90 text-3xl disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
                  title="Show items"
                  onClick={(event) => {
                     event.stopPropagation();
                     if (userInfo) {
                        setIsOpenItemsModal(true);
                     } else {
                        toast.error("You must sign in to continue!");
                     }
                  }}
                  disabled={
                     product.agency && product.agency.isActive == 1
                        ? false
                        : true
                  }
               >
                  <BiCartAlt />
               </button>
               <button
                  className="w-14 h-14 rounded-2xl flex justify-center items-center text-white bg-primary-color hover:shadow-primary-color hover:shadow-lg text-3xl"
                  title="Quick view"
                  onClick={(event) => {
                     event.stopPropagation();
                     setIsOpenQuickViewModal(true);
                  }}
               >
                  <BiShowAlt />
               </button>
               {inCompare ? (
                  <button
                     className="w-14 h-14 rounded-2xl flex justify-center items-center text-white bg-primary-color hover:shadow-primary-color  hover:shadow-lg text-3xl"
                     title="Remove compare"
                     onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveCompare();
                     }}
                  >
                     <BiUndo />
                  </button>
               ) : (
                  <button
                     className="w-14 h-14 rounded-2xl flex justify-center items-center text-white bg-primary-color hover:shadow-primary-color hover:shadow-lg text-3xl"
                     title="Add compare"
                     onClick={(event) => {
                        event.stopPropagation();
                        handleAddCompare();
                     }}
                  >
                     <BiGitCompare />
                  </button>
               )}
            </div>

            <div className="absolute top-0 right-0 bg-light-primary dark:bg-dark-primary rounded-lg flex justify-center items-center">
               {!stateLike ? (
                  <button
                     className="bg-secondary-color text-2xl hover:text-3xl transition-all p-1 rounded-xl m-2"
                     title="like"
                     onClick={(event) => {
                        event.stopPropagation();
                        handleAddToWishList();
                     }}
                  >
                     <AiOutlineHeart />
                  </button>
               ) : (
                  <button
                     className="bg-secondary-color text-2xl hover:text-3xl transition-all p-1 rounded-xl m-2"
                     title="unlike"
                     onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveToWishList();
                     }}
                  >
                     <AiFillHeart />
                  </button>
               )}
            </div>
         </div>

         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center sm:justify-center justify-start z-50 ${
               isOpenQuickViewModal ? "flex" : "hidden"
            }`}
         >
            {isOpenQuickViewModal && (
               <div className="sm:w-3/5 w-full h-fit overflow-x-auto">
                  <QuickView
                     postID={product.id}
                     setIsOpenQuickViewModal={setIsOpenQuickViewModal}
                  />
               </div>
            )}
         </div>
         <div
            className={`fixed top-0 left-0 w-full h-screen backdrop-blur-sm items-center sm:justify-center justify-start z-30 ${
               isOpenItemsModal ? "flex" : "hidden"
            }`}
         >
            {isOpenItemsModal && (
               <div className="sm:w-3/4 w-full h-[34rem] overflow-x-auto">
                  <ItemsInPost
                     items={product.itemPostSet}
                     setIsOpenItemsModal={setIsOpenItemsModal}
                  />
               </div>
            )}
         </div>
      </div>
   );
};

export default ProductItem;
