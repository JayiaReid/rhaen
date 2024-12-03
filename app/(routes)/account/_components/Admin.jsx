"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { LoaderPinwheelIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Admin = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  //   orders
  const [notComp, setNotComp] = useState([]);
  const [comp, setComp] = useState([]);
  const [UP, setUP] = useState([]);

  const [type, setType] = useState("orders");
  const [showorder, setShowOrder] = useState("");

  const [cakes, setCakes] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      getOrder();
      fetchCakes();
      fetchRecipes();
    }
  }, [isSignedIn, user, router]);

  const getOrder = async () => {
    axios.get("/api/orders").then((res) => {
      //   const compOrders = filtered.filter(order => order.status == "done")
      const UPOrders = res.data.filter(
        (order) => order.status == "not started"
      );
      const NCOrders = res.data.filter(
        (order) => order.status == "in progress"
      );
      const COrders = res.data.filter((order) => order.status == "done");
      setNotComp(NCOrders);
      setComp(COrders);
      setUP(UPOrders);
      console.log(res.data);
    });
  };

  const fetchCakes = async () => {
    const res = await axios.get("/api/cakes");
    setCakes(res.data);
  };

  const fetchRecipes = async () => {
    const res = await axios.get("/api/recipes");
    setRecipes(res.data);
  };

  const handleCreateCake = async () => {
    const newCake = { name: "New Cake", description: "Delicious cake" }; // Example data
    await axios.post("/api/cakes", newCake);
    fetchCakes();
  };

  const handleUpdateCake = async (id) => {
    const updatedCake = {
      name: "Updated Cake",
      description: "Even better cake",
    };
    await axios.put(`/api/cakes/${id}`, updatedCake);
    fetchCakes();
  };

  const handleDeleteCake = async (id) => {
    await axios.delete(`/api/cakes/${id}`);
    fetchCakes();
  };

  const handleCreateRecipe = async () => {
    const newRecipe = { name: "New Recipe", ingredients: ["Flour", "Sugar"] }; // Example data
    await axios.post("/api/recipes", newRecipe);
    fetchRecipes();
  };

  const handleUpdateRecipe = async (id) => {
    const updatedRecipe = {
      name: "Updated Recipe",
      ingredients: ["Flour", "Honey"],
    };
    await axios.put(`/api/recipes/${id}`, updatedRecipe);
    fetchRecipes();
  };

  const handleDeleteRecipe = async (id) => {
    await axios.delete(`/api/recipes/${id}`);
    fetchRecipes();
  };

  return (
    <div>
      <div className="p-5">
        <Breadcrumb>
          <BreadcrumbList className="text-xl">
            <BreadcrumbItem>
              <BreadcrumbLink className="hover:text-primary" href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">
                Admin : {user.id}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* orders */}
      <div className="p-5">
      <h2 className="text-2xl text-center text-white font-bold my-6">Orders</h2>
        
        {type === "orders" && (
          <div>
            <div className="grid grid-cols-3 gap-3 p-3">
              <div className="p-5 border rounded-xl">
                <h2 className="text-orange-300 text-xl font-bold">
                  Unprocessed Orders
                </h2>
                <h2 className="text-white text-2xl">{UP.length}</h2>
              </div>
              <div className="p-5 border rounded-xl">
                <h2 className="text-yellow-200 text-xl font-bold">
                  Orders To be Completed
                </h2>
                <h2 className="text-white text-2xl">{notComp.length}</h2>
              </div>
              <div className="p-5 border rounded-xl">
                <h2 className="text-green-300 text-xl font-bold">
                  Completed Orders
                </h2>
                <h2 className="text-white text-2xl">{comp.length}</h2>
              </div>
            </div>
            <h2
              onClick={() => setShowOrder("UP")}
              className="cursor-pointer text-2xl font-bold text-white my-5 mx-5 flex gap-2 items-center"
            >
              <div className="h-5 w-5 bg-orange-300 rounded-full" />
              Unprocessed Orders ({UP?.length}){" "}
            </h2>
            {UP.length > 0 && showorder == "UP" && (
              <div className="flex flex-wrap gap-5 mt-5">
                {UP.map((order) => (
                  <div key={order.id} className="flex-1 min-w-[300px]">
                    <OrderItem
                      admin={true}
                      order={order}
                      curr={showorder}
                      refreshData={() => getOrder()}
                    />
                  </div>
                ))}
              </div>
            )}
            <h2
              onClick={() => setShowOrder("NC")}
              className=" cursor-pointer text-2xl font-bold text-white my-5 mx-5 flex gap-2 items-center"
            >
              <div className="h-5 w-5 bg-yellow-300 rounded-full" /> Not
              Completed Orders ({notComp?.length}){" "}
            </h2>
            {notComp.length > 0 && showorder == "NC" && (
              <div className="flex flex-wrap gap-5 mt-5">
                {notComp.map((order) => (
                  <div key={order.id} className="flex-1 min-w-[300px]">
                    <OrderItem
                      admin={true}
                      order={order}
                      curr={true}
                      refreshData={() => getOrder()}
                    />
                  </div>
                ))}
              </div>
            )}
            <h2
              onClick={() => setShowOrder("C")}
              className="cursor-pointer text-2xl font-bold text-white my-5 mx-5 flex gap-2 items-center"
            >
              <div className="h-5 w-5 bg-green-300 rounded-full" /> Completed
              Orders ({comp?.length}){" "}
            </h2>
            {comp.length > 0 && showorder == "C" && (
              <div className="flex flex-wrap gap-5 mt-5">
                {comp.map((order) => (
                  <div key={order.id} className="flex-1 min-w-[300px]">
                    <OrderItem
                      admin={true}
                      order={order}
                      curr={true}
                      refreshData={() => getOrder()}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/*  cards: unprocessed orders, to be completed, completed */}

      {/* cakes */}
      {/* crud cakes, get cakes and all that */}
    </div>
  );
};

export default Admin;
