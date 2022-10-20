import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useEffect, useState, useContext } from "react";
import Advertise from "../components/Advertise";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Layout from "../components/Layout/Layout";
import ProductItem from "../components/ProductItem";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { Store } from "../utils/Store";
import API, { endpoints } from "../API";
import { userInfo } from "os";
import Cookies from "js-cookie";

export default function Home({ categories, salePosts }) {
   const router = useRouter();
   const searchInput = useRef(null);
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   // const [cate, setCate] = useState([]);
   // useEffect(() => {
   //    const loadCate = async () => {
   //       try {
   //          const res = await axios.get(
   //             "http://localhost:8080/ecommerce/api/agency-field/all"
   //          );
   //          console.log(res.data.data);
   //          setCate(res.data.data);
   //       } catch (error) {
   //          console.log(error);
   //       }
   //    };
   //    loadCate();
   // }, []);

   const mockProduct = [
      {
         id: 1,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
      {
         id: 2,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
      {
         id: 3,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
      {
         id: 4,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
      {
         id: 5,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
      {
         id: 6,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
   ];
   const addToCartHandler = async (product) => {
      if (Cookies.get("accessToken")) {
         const existItem = state.cart.cartItems.find(
            (x) => x._id === product._id
         );
         const quantity = existItem ? existItem.quantity + 1 : 1;
         dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
      } else {
         router.push("/signin");
      }
      // const { data } = await axios.get(`/api/products/${product._id}`);
      // if (data.countInStock < quantity) {
      //    window.alert("Sorry. Product is out of stock");
      //    return;
      // }
      // router.push("/cart");
   };
   const search = (e: any) => {
      e.preventDefault();
      const query = searchInput.current.value;
      if (!query) {
         searchInput.current.focus();
      } else {
         router.push(`/search?input=${query}`);
      }
   };
   return (
      <div>
         <Layout title="Home">
            <SearchBar categories={categories} />

            {/* <div className="text-center font-bold text-xl mb-3">Category</div> */}
            {/* <CategoryList categories={categories} /> */}
            <div className="my-8">
               <Advertise />
               <h1 className="text-center font-bold text-xl my-5">All Posts</h1>
               <div className="grid lg:grid-cols-5 grid-cols-2 gap-10">
                  {salePosts.map((i) => (
                     <ProductItem
                        key={i.id}
                        product={i}
                        addToCartHandler={addToCartHandler}
                     />
                  ))}
               </div>
            </div>
         </Layout>
      </div>
   );
}
export const getStaticProps = async () => {
   const resCategories = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/category/all"
   );
   const categories = await resCategories.data.data;
   const resAllProduct = await API.get(endpoints["get_all_salePost"]);
   const salePosts = await resAllProduct.data.data;
   return { props: { categories, salePosts } };
};
