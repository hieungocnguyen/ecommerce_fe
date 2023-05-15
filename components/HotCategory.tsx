import Image from "next/image";
import Link from "next/link";
import useTrans from "../hook/useTrans";

const HotCategory = ({ categoryList }) => {
   const trans = useTrans();
   return (
      <div className="mb-4">
         <div className="text-2xl font-bold mb-4">
            {trans.home.trendingCategory}
         </div>
         <div className="grid grid-cols-5 gap-10">
            {categoryList.map((i) => (
               <div key={i.id}>
                  <CardCategory category={i} />
               </div>
            ))}
         </div>
      </div>
   );
};

export const CardCategory = ({ category }) => {
   return (
      <Link href={`/category/${category.id}`}>
         <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 cursor-pointer hover:shadow-lg">
            <div className="relative overflow-hidden w-3/4 mx-auto aspect-square bg-light-primary dark:bg-dark-primary rounded-xl">
               <Image
                  src={category.avatar}
                  alt=""
                  layout="fill"
                  className="object-cover"
               />
            </div>
            <div className="text-center font-bold mt-4 uppercase h-12 text-primary-color line-clamp-2">
               {category.name}
            </div>
         </div>
      </Link>
   );
};

export default HotCategory;