/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../../../API";
import LayoutDashboard from "../../../components/Dashboard/LayoutDashboardManager";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
import styled from "@emotion/styled";
import {
   FormControl,
   InputLabel,
   MenuItem,
   Select,
   TextField,
} from "@mui/material";
import Loader from "../../../components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { BiEditAlt, BiSave, BiTrashAlt, BiUpload } from "react-icons/bi";
import EditItem from "../../../components/EditItem";
import axios from "axios";
import NewItem from "../../../components/NewItem";
import dynamic from "next/dynamic";

const CssTextField = styled(TextField)({
   "& .MuiOutlinedInput-root": {
      "& fieldset": {
         borderColor: "white",
      },
      "&:hover fieldset": {
         borderColor: "#525EC1",
      },
      "&.Mui-focused fieldset": {
         borderColor: "#525EC1",
      },
   },
});

const ItemsOfPost = () => {
   const router = useRouter();
   const id = router.query.id;
   const [items, setItems] = useState<any>([]);
   const [importImage, setImportImage] = useState(false);
   const [loading, setLoading] = useState(false);
   const [salePost, setSalePost] = useState<any>([]);
   const [picturesSet, setPicturesSet] = useState([]);
   const [itemID, setItemID] = useState(-1);
   const [isOpenNewItem, setIsOpenNewItem] = useState(false);

   const addImageSet = async (image) => {
      try {
         setLoading(true);
         const uploadCloud = await API.post(
            endpoints["upload_cloudinary"],
            {
               file: image,
            },
            {
               headers: {
                  "Content-Type": "multipart/form-data",
               },
            }
         );
         const createPicture = await API.post(endpoints["create_piture"], {
            image: uploadCloud.data.data,
            postID: id,
         });
         if (createPicture) {
            setLoading(false);
            toast.success("Add picture successful!", {
               position: "top-center",
            });
            loadItems();
         }
      } catch (error) {
         setLoading(false);
         toast.error(`${error.response.data}`, {
            position: "top-center",
         });
      }
   };
   const deleteHandle = async (p) => {
      try {
         setLoading(true);
         const resDetele = await API.delete(endpoints["picture_post"](p.id));
         if (resDetele) {
            setLoading(false);
            toast.success("Delete picture successful!", {
               position: "top-center",
            });
         }
      } catch (error) {
         toast.error(`${error.response.data}`, {
            position: "top-center",
         });
      }

      loadItems();
   };

   const loadItems = async () => {
      const resItems = await API.get(endpoints["salePost"](id));
      setItems(resItems.data.data.itemPostSet);
      setPicturesSet(resItems.data.data.picturePostSet);
      setSalePost(resItems.data.data);
   };

   useEffect(() => {
      if (id) {
         loadItems();
      }
   }, [id, isOpenNewItem, itemID]);

   const handleDeleteItem = async (i) => {
      const resDelete = await API.delete(endpoints["item"](i.id));
      loadItems();
      toast.success("Delete item successful!", {
         position: "bottom-center",
      });
   };

   return (
      <LayoutDashboard>
         <div className="relative p-8">
            <div>
               <div className="flex justify-between mb-4">
                  <div className="font-semibold text-2xl">Items</div>
                  <div
                     className="p-3 bg-blue-main rounded-lg font-semibold  cursor-pointer shadow-sm shadow-blue-main hover:shadow-lg hover:shadow-blue-main"
                     onClick={() => setIsOpenNewItem(true)}
                  >
                     Create new items
                  </div>
               </div>

               {items.length > 0 ? (
                  <div>
                     <div className="rounded-lg bg-dark-primary overflow-hidden shadow-2xl shadow-dark-shadow">
                        <ul className="grid grid-cols-12 p-5 bg-dark-spot items-center font-semibold">
                           <li className="col-span-1 ">Image</li>
                           <li className="col-span-3 ">Name</li>
                           <li className="col-span-3 ">Description</li>
                           <li className="col-span-2 ">Unit Price</li>
                           <li className="col-span-2 ">Inventory</li>
                           <li className="col-span-1 "></li>
                        </ul>
                        {items
                           .sort((a, b) => (a.id < b.id ? 1 : -1))
                           .map((i) => (
                              <div key={i.id}>
                                 <ul className="grid grid-cols-12 p-5 items-center hover:bg-dark-bg">
                                    <li className="col-span-1">
                                       <Image
                                          src={i.avatar}
                                          alt=""
                                          width={42}
                                          height={42}
                                          className="object-cover rounded-full"
                                       />
                                    </li>
                                    <li className="col-span-3">{i.name}</li>
                                    <li className="col-span-3">
                                       {i.description}
                                    </li>
                                    <li className="col-span-2">
                                       {i.unitPrice.toLocaleString("it-IT", {
                                          style: "currency",
                                          currency: "VND",
                                       })}
                                    </li>
                                    <li className="col-span-2">
                                       {i.inventory}
                                    </li>
                                    <li className="col-span-1 flex gap-3">
                                       <div
                                          className=" p-3 bg-green-800  rounded-lg cursor-pointer flex justify-center items-center text-xl"
                                          onClick={() => {
                                             setItemID(i.id);
                                          }}
                                       >
                                          <BiEditAlt />
                                       </div>
                                       <div
                                          className=" p-3 bg-red-800  rounded-lg cursor-pointer text-xl"
                                          onClick={() => handleDeleteItem(i)}
                                       >
                                          <AiOutlineDelete />
                                       </div>
                                    </li>
                                 </ul>
                              </div>
                           ))}
                     </div>
                  </div>
               ) : (
                  <div className="flex justify-center">
                     <img
                        src="https://cdni.iconscout.com/illustration/free/thumb/cart-is-empty-2100980-1763838.png"
                        alt=""
                        className="w-40"
                     />
                  </div>
               )}
            </div>
            <div className="">
               <div className="flex justify-between items-center my-6">
                  <div className="font-semibold text-xl">Set Picture </div>
               </div>
               <div className="grid grid-cols-6 gap-8 mb-10">
                  <div className="rounded-lg bg-dark-primary text-4xl hover:opacity-80 aspect-square">
                     <label
                        htmlFor="upload-set_picure_post"
                        className=" w-full h-full flex justify-center items-center cursor-pointer"
                     >
                        <BiUpload />
                     </label>

                     <input
                        type="file"
                        name="photoSet"
                        id="upload-set_picure_post"
                        className="hidden"
                        onChange={(e) => {
                           addImageSet(e.target.files[0]);
                        }}
                     />
                  </div>
                  {picturesSet
                     .sort((a, b) => (a.id < b.id ? 1 : -1))
                     .map((p) => (
                        <div key={p.id}>
                           <div className="relative overflow-hidden col-span-1 aspect-square rounded-xl group">
                              <Image
                                 src={p.image}
                                 alt="pic"
                                 layout="fill"
                                 className="object-cover"
                              />
                              <div
                                 className="w-full h-2/5  bg-red-800 absolute -bottom-24 group-hover:bottom-0 transition-all ease-out cursor-pointer flex justify-center items-center bg-opacity-80"
                                 onClick={() => deleteHandle(p)}
                              >
                                 <BiTrashAlt className="text-dark-text text-3xl" />
                              </div>
                           </div>
                        </div>
                     ))}
               </div>
            </div>
            <div
               className={`absolute top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center ${
                  itemID > 0 ? "flex" : "hidden"
               }`}
            >
               <div className="w-2/3">
                  <EditItem
                     itemID={itemID}
                     setItemID={setItemID}
                     setLoading={setLoading}
                  />
               </div>
            </div>
            <div
               className={`absolute top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center ${
                  isOpenNewItem ? "flex" : "hidden"
               }`}
            >
               <div className="w-2/3 ">
                  <NewItem
                     postID={id}
                     setIsOpenNewItem={setIsOpenNewItem}
                     setLoading={setLoading}
                  />
               </div>
            </div>
         </div>

         {loading ? <Loader /> : <></>}
         <Toaster />
      </LayoutDashboard>
   );
};

// export default ItemsOfPost;
export default dynamic(() => Promise.resolve(ItemsOfPost), { ssr: false });