import { positions } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BiCaretLeft, BiPencil } from "react-icons/bi";
import API, { endpoints } from "../../API";
import useTrans from "../../hook/useTrans";

const AddressSelect = ({
   setAddress,
   setIsOpenAddressSelect,
   isOpenAddressSelect,
   setIsOpenModelGeoLocation,
}) => {
   const wrapperRef = useRef(null);
   const [province, setProvince] = useState([]);
   const [district, setDistrict] = useState([]);
   const [ward, setWard] = useState([]);
   const [street, setStreet] = useState("empty");
   const [wardID, setWardID] = useState(0);
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const trans = useTrans();

   const fetchProvinceAll = async () => {
      try {
         const res = await API.get(endpoints["get_location_all_provinces"]);
         setProvince(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };
   const handleSelectProvince = (provinceID: string) => {
      try {
         const fetchDistrictByProvinceID = async (provinceID) => {
            const res = await API.get(
               endpoints["get_location_district_by_provinceID"](provinceID)
            );
            setDistrict(res.data.data);
            setWard([]);
            setStreet("empty");
         };
         fetchDistrictByProvinceID(provinceID);
      } catch (error) {
         console.log(error);
      }
   };
   const handleSelectDistrict = (districtID: string) => {
      try {
         const fetchWardByDistrictID = async (districtID) => {
            const res = await API.get(
               endpoints["get_location_ward_by_districtID"](districtID)
            );
            setWard(res.data.data);
            setStreet("empty");
         };
         fetchWardByDistrictID(districtID);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (isOpenAddressSelect) {
         fetchProvinceAll();
      }

      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpenAddressSelect(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef, isOpenAddressSelect]);

   const submitHandler = async ({ street }) => {
      if (wardID > 0) {
         try {
            const resGetLocation = await API.get(
               endpoints["get_full_address"](wardID)
            );
            setAddress(`${street}, ${resGetLocation.data.data}`);
            setIsOpenAddressSelect(false);
            toast.success("Select new address successful!", {
               position: "top-center",
            });
         } catch (error) {
            console.log(error);
            toast.error("Something wrong, please try again later!", {
               position: "top-center",
            });
         }
      } else {
         toast.error("Please choose your ward!");
      }
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8"
         ref={wrapperRef}
      >
         <div className="flex justify-between items-center mb-6">
            <div className="font-semibold text-xl">
               {trans.profile.edit_profile.address_model.select_new_address}
            </div>
            <div
               className="flex gap-1 cursor-pointer"
               onClick={() => {
                  setIsOpenAddressSelect(false);
                  setIsOpenModelGeoLocation(true);
               }}
            >
               <div>
                  <BiCaretLeft className="text-xl text-primary-color" />
               </div>
               <div className="font-medium">
                  {trans.profile.edit_profile.address_model.switch_to_auto}
               </div>
            </div>
         </div>
         {isOpenAddressSelect ? (
            <>
               <form
                  className="grid grid-cols-12 gap-4"
                  onSubmit={handleSubmit(submitHandler)}
               >
                  <div className="col-span-4 text-left">
                     <label
                        htmlFor="province"
                        className="font-semibold text-sm"
                     >
                        {trans.profile.edit_profile.address_model.province}
                     </label>
                     <select
                        id="province"
                        className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:cursor-not-allowed"
                        onChange={(e) => {
                           handleSelectProvince(e.target.value);
                        }}
                     >
                        <option value={0} className="hidden">
                           {trans.profile.edit_profile.address_model.select}
                           {trans.profile.edit_profile.address_model.province}
                        </option>
                        {province.map((p) => (
                           <option
                              key={p.provinceID}
                              value={p.provinceID}
                              className=""
                           >
                              {p.provinceName}
                           </option>
                        ))}
                     </select>
                  </div>
                  <div className="col-span-4 text-left">
                     <label
                        htmlFor="district"
                        className="font-semibold text-sm"
                     >
                        {trans.profile.edit_profile.address_model.district}
                     </label>
                     <select
                        id="district"
                        className="bg-light-bg dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:cursor-not-allowed"
                        onChange={(e) => handleSelectDistrict(e.target.value)}
                        disabled={district.length > 0 ? false : true}
                     >
                        <option value={0} className="hidden">
                           {trans.profile.edit_profile.address_model.select}
                           {trans.profile.edit_profile.address_model.district}
                        </option>
                        {district.map((p) => (
                           <option key={p.districtID} value={p.districtID}>
                              {p.districtName}
                           </option>
                        ))}
                     </select>
                  </div>
                  <div className="col-span-4 text-left">
                     <label htmlFor="ward" className="font-semibold text-sm">
                        {trans.profile.edit_profile.address_model.ward}
                     </label>
                     <select
                        id="ward"
                        className="bg-light-bg dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:cursor-not-allowed"
                        disabled={ward.length > 0 ? false : true}
                        onChange={(e) => {
                           setStreet("");
                           setWardID(Number(e.target.value));
                        }}
                     >
                        <option value={0} className="hidden">
                           {trans.profile.edit_profile.address_model.select}
                           {trans.profile.edit_profile.address_model.ward}
                        </option>
                        {ward.map((p) => (
                           <option key={p.wardID} value={p.wardID}>
                              {p.wardName}
                           </option>
                        ))}
                     </select>
                  </div>
                  <div className="col-span-12 text-left">
                     <div>
                        <label
                           htmlFor="street"
                           className="font-semibold text-sm"
                        >
                           {trans.profile.edit_profile.address_model.street}
                        </label>
                        <input
                           {...register("street")}
                           id="street"
                           name="street"
                           required
                           type="text"
                           placeholder={
                              trans.profile.edit_profile.address_model.street
                           }
                           className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:bg-light-bg disabled:cursor-not-allowed"
                           disabled={street == "empty" ? true : false}
                        />
                     </div>
                  </div>
                  <div className="col-span-12">
                     <button
                        type="submit"
                        className="px-4 py-3 bg-primary-color rounded-lg text-white font-semibold hover:shadow-lg transition-all hover:shadow-primary-color"
                     >
                        {trans.profile.edit_profile.address_model.submit}
                     </button>
                  </div>
               </form>
            </>
         ) : (
            <></>
         )}
      </div>
   );
};

export default AddressSelect;
