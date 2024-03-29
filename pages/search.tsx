/* eslint-disable react-hooks/exhaustive-deps */
import { Slider, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import API, { endpoints } from "../API";
import Layout from "../components/Layout/Layout";
// import ProductItem from "../components/ProductItem";
import SearchBar from "../components/SearchBar";
import Image from "next/image";
import emptyBox from "../public/empty-box.png";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { ClipLoader } from "react-spinners";
import useTrans from "../hook/useTrans";

const ProductItem = dynamic(import("../components/ProductItem"));

function valuetext(value: number) {
   return `${value.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
   })}`;
}
const Search = ({ categories }) => {
   const [salePosts, setSalePosts] = useState([]);
   const router = useRouter();
   const kw = router.query.input;
   const [datePost, setDatePost] = useState(["2017-06-01", "2023-07-01"]);
   const [value, setValue] = useState<number[]>([100000, 5000000]);
   const [numberPage, setNumberPage] = useState(1);
   const [totalPage, setTotalPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [categoryID, setCategoryID] = useState(0);
   const [agencyNameSearch, setAgencyNameSearch] = useState("");
   const [isFetching, setIsFetching] = useState(false);
   const { locale } = useRouter();
   const trans = useTrans();

   const loadPosts = async () => {
      setIsFetching(true);
      try {
         const resPosts = await API.post(endpoints["search_salePost"], {
            kw: router.query.input,
            page: numberPage,
            fromDate: router.query.fromDate,
            fromPrice: Number(router.query.fromPrice),
            toDate: router.query.toDate,
            toPrice: Number(router.query.toPrice),
            categoryID: Number(router.query.categoryID),
            nameOfAgency: router.query.nameOfAgency,
         });
         setSalePosts(resPosts.data.data.listResult);
         setTotalPage(
            Math.ceil(
               resPosts.data.data.listResult.length /
                  resPosts.data.data.pageSize
            )
         );
         setIsFetching(false);
      } catch (error) {
         console.log(error);
         setIsFetching(false);
         toast.error("Something wrong, please try again!");
      }
   };
   useEffect(() => {
      loadPosts();
   }, [router.query, numberPage]);

   const handleSubmitFilter = async (e) => {
      e.preventDefault();
      router.push(
         `/search?input=${kw}&fromPrice=${value[0]}&toPrice=${value[1]}${
            categoryID > 0 ? `&categoryID=${categoryID}` : ""
         }${
            agencyNameSearch != "" ? `&nameOfAgency=${agencyNameSearch}` : ""
         }&fromDate=${new Date(datePost[0]).toLocaleDateString(
            "en-GB"
         )}&toDate=${new Date(datePost[1]).toLocaleDateString("en-GB")}`
      );
      setNumberPage(1);
      loadPosts();
   };

   const handleChange = (event: Event, newValue: number | number[]) => {
      setValue(newValue as number[]);
   };
   return (
      <Layout title="Search Page">
         <div className="my-4">
            <SearchBar categories={categories} setNumberPage={setNumberPage} />
            {router.query.input ? (
               <div className="text-2xl my-8 italic">
                  {trans.search.result_for} &quot;{router.query.input}&quot;
               </div>
            ) : (
               <div> </div>
            )}
            <div className="grid grid-cols-8 gap-8">
               {/* filter side */}
               <form
                  onSubmit={handleSubmitFilter}
                  className="col-span-2 dark:bg-dark-primary bg-light-primary rounded-lg text-left p-6 h-fit"
               >
                  <div className="flex justify-between mb-4 items-center">
                     <label htmlFor="fromDate" className="font-semibold">
                        {trans.search.filter.from_date}:
                     </label>
                     <input
                        type="date"
                        id="fromDate"
                        className="p-2"
                        defaultValue={datePost[0]}
                        onChange={(e) => {
                           setDatePost([e.target.value, datePost[1]]);
                        }}
                     />
                  </div>
                  <div className="flex justify-between mb-4 items-center">
                     <label htmlFor="toDate" className="font-semibold">
                        {trans.search.filter.to_date}:
                     </label>
                     <input
                        type="date"
                        id="toDate"
                        className="p-2"
                        defaultValue={datePost[1]}
                        onChange={(e) => {
                           setDatePost([datePost[0], e.target.value]);
                        }}
                     />
                  </div>
                  <div className="font-semibold mb-2">
                     {trans.search.filter.price}:
                  </div>
                  <div className="w-full">
                     <Slider
                        getAriaLabel={() => "Price range"}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        valueLabelFormat={valuetext}
                        step={100000}
                        // marks
                        max={10000000}
                        min={10000}
                        sx={{
                           color: "#2065d1",
                        }}
                     />
                  </div>
                  <div className="font-semibold mb-2">
                     {trans.search.filter.category}:
                  </div>
                  <select
                     id="category"
                     name="categoryID"
                     onChange={(e) => {
                        setCategoryID(Number(e.target.value));
                     }}
                     className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                     title="category"
                  >
                     <option value={0}>
                        --{trans.search.filter.select_category}--
                     </option>
                     {categories.map((category) => (
                        <option value={category.id} key={category.id}>
                           {locale == "vi" ? category.nameVi : category.name}
                        </option>
                     ))}
                  </select>
                  <div className="font-semibold mt-4 mb-2">
                     {trans.search.filter.merchant_name}:
                  </div>
                  <div className="">
                     <input
                        type="text"
                        className="p-3 w-full rounded-lg"
                        placeholder={trans.search.filter.merchant_name}
                        onChange={(e) => setAgencyNameSearch(e.target.value)}
                     />
                  </div>
                  <div className="flex justify-center mt-6">
                     <button
                        className="p-4 bg-primary-color text-white rounded-lg font-semibold my-4 hover:opacity-80"
                        type="submit"
                     >
                        {trans.search.filter.submit}
                     </button>
                  </div>
               </form>
               {/* posts side */}
               {!isFetching ? (
                  salePosts.length > 0 ? (
                     <div className="col-span-6 grid grid-cols-3 gap-8">
                        {salePosts.map((post) => (
                           <ProductItem
                              key={post.id}
                              product={post}
                              inCompare={false}
                           />
                        ))}
                     </div>
                  ) : (
                     <div className="col-span-6 flex justify-center items-center">
                        <div className="relative overflow-hidden aspect-square w-1/3 mx-auto">
                           <Image
                              src={emptyBox}
                              alt="empty"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                     </div>
                  )
               ) : (
                  <div className="col-span-6 mt-20">
                     <div className="flex justify-center items-center">
                        <ClipLoader size={50} color="#FF8500" />
                     </div>
                  </div>
               )}
            </div>
            {/* paginate */}
            <div
               className="flex gap-4
                      justify-center mt-8"
            >
               {totalPage > 1 &&
                  Array.from(Array(totalPage), (e, i) => {
                     return (
                        <div
                           key={i}
                           className={`w-8 h-8 rounded-lg border-2 border-primary-color flex justify-center items-center cursor-pointer paginator font-semibold ${
                              numberPage === i + 1
                                 ? "bg-primary-color text-white"
                                 : ""
                           } `}
                           onClick={(e) => {
                              setNumberPage(i + 1);
                              window.scrollTo({
                                 top: 0,
                                 behavior: "smooth",
                              });
                           }}
                        >
                           {i + 1}
                        </div>
                     );
                  })}
            </div>
         </div>
      </Layout>
   );
};

export default Search;
export const getServerSideProps = async () => {
   const resCategories = await API.get(endpoints["category_all"]);
   const categories = await resCategories.data.data;
   return { props: { categories } };
};
