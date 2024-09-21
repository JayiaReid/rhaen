"use client"
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowBigDown, LoaderPinwheelIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import CardComp from "./_components/Card";
import { toast } from "@/hooks/use-toast";

// add to toasts, add account page, checkout

export default function Home() {
  const [cakes, setCakes] = useState([])
  const [review_title, setTitle] = useState('')
  const [review, setReview] = useState('')
  const [reviews, setReviews] = useState([])
  const [recipe, setRecipe] = useState({})
  const [loading, setLoading]=useState(true)

  useEffect( () => {
    
    const fetchData = async ()=>{
      await fetchCakes();
    await fetchReviews()
    await fetchRecipe();
    setLoading(false);
    }
    
   fetchData()
  }, []);

  const fetchCakes = async () => {
    const response = await fetch('/api/cakes');
    const data = await response.json();
    setCakes(data);
    console.log(data)
  };

  const fetchRecipe = async () => {
    axios.get('/api/recipes').then(res => setRecipe(res.data[Math.floor(Math.random() * res.data.length)]))
  }

  const fetchReviews = async () => {
    axios.get('/api/reviews').then(res => setReviews(res.data))
  }

  const submitReview = async () => {
    axios.post('/api/reviews', {
      id: Date.now(),
      title: review_title,
      review: review
    }).then(res => {
      console.log(res)
      setReview('')
      setTitle('')
      toast({
        title: "review added. Thank you!"
      })
      fetchReviews()

    })
  }

  if (loading) return <div className="h-screen w-screen flex items-center justify-center">
      <LoaderPinwheelIcon className="animate-spin text-primary"/>
  </div>

  return (
    <div className="h-screen ">
      <div className="w-screen lg:h-screen sm:hidden lg:block">
        <video autoPlay muted loop className="fixed top-0 left-0 min-w-[100%] object-fill z-[-1]">
          <source src="https://assets.mixkit.co/videos/26640/26640-720.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="flex h-[90%] w-[100%] items-center justify-center">
          <h2 className="text-6xl text-black font-bold border-l-4 border-l-black bg-opacity-10 bg-black p-5">Order Your Fav Cakes or Discover Recipes!</h2>
        </div>
      </div>
      <div className="bg-black h-auto flex flex-col items-center justify-center">
        <h2 className="text-primary-foreground text-2xl m-4">Top Orders. <span className="text-primary">See what our customers are loving. </span></h2>
        <Carousel opts={{ align: "start" }} className="w-full max-w-[80%] max-h-[100%]">
          <CarouselContent className="max-w-[90%]">
            {cakes.map((cake, index) => ( 
              index < 4 ?
              <CarouselItem key={cake.id} className="md:basis-1/2 lg:basis-2/3 bg-black ">
                <div className="p-2 ">
                  <CardComp cake={cake} price={false}/>
                </div>
              </CarouselItem>
            : null))}
          </CarouselContent>
          <CarouselPrevious className="text-primary bg-black font-bold" />
          <CarouselNext className="text-primary bg-black font-bold" />
        </Carousel>
        <Button className="my-4"><Link href={'/cakes/sellers'}>See more</Link></Button>
      </div>

      <div className="flex items-center my-20 w-full justify-center p-5">
        <Card className="w-[800px] h-auto p-1 mt-8 bg-black border-none text-white">
          <CardContent>
            <CardHeader>
              <CardTitle className="text-3xl">A Random Top Recipe</CardTitle>
              <CardDescription>
                One of most popular recipes viewed today.
              </CardDescription>
            </CardHeader>
            <div className="flex items-center justify-evenly gap-6 ">
              {recipe.image ? (
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  width={600}
                  height={600}
                  className="object-cover w-[400px] h-[350px] rounded-lg"
                />
              ) : (
                <span className="text-3xl font-semibold">{recipe.name}</span>
              )}
              <div className="flex gap-2 flex-col">
                <h2 className="text-white text-lg font-bold">{recipe.name}</h2>
                <h2 className="font-bold text-primary underline">Ingredients</h2>
                <h2 className="text-white">{recipe.ingredients}</h2>
                <h2 className="font-bold text-primary underline">Instructions</h2>
                <h2 className="text-white">{recipe.instructions}</h2>
              </div>
              
            </div>
            <div className="text-center">
            <Button className="my-4"><Link href={'/cakes/recipes'}>See more</Link></Button>
            </div>
          </CardContent>
        </Card>
        
      </div>
      <div className="flex items-center justify-center h-auto p-8 flex-col bg-black text-white">
        <h2 className="text-primary-foreground font-bold text-4xl m-4">Reviews</h2>
        <ScrollArea className="w-[60%] h-[400px] overflow-y-scroll border rounded-lg p-3 m-6">
          {reviews.map((review, index) => (
            <div key={index} className="p-10">
              <h2 className="text-xl text-primary font-bold py-2">{review.title}</h2>
              <h2 className="text-white pb-6">{review.review}</h2>
              <Separator />
            </div>
          ))}
        </ScrollArea>
      </div>

      <div>

      </div>
      <div className="flex items-center w-full justify-center p-5 my-20">
        {/* review form */}
        <Card className="w-[800px] h-[500px] mt-8 bg-black border-none text-white">
          <CardContent>
            <CardHeader>
              <CardTitle className="text-3xl">Satisfied or Unsatisfied?</CardTitle>
              <CardDescription>
                Leave a review or make suggestions.
              </CardDescription>
            </CardHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="name" className="text-left text-xl">
                  Title
                </Label>
                <Input id="name" placeHolder="eg. Great Service" onChange={(e) => setTitle(e.target.value)} value={review_title} className="col-span-3" />
              </div>
              <div className="flex flex-col gap-4 mt-3">
                <Label htmlFor="username" className="text-left text-xl">
                  Review
                </Label>
                <Textarea placeHolder="I'd rate this 100/10 if I could" onChange={(e) => setReview(e.target.value)} id="username" value={review} className="col-span-3" />
              </div>
            </div>
            <div className="flex items-center p-3 mt-3 justify-center">
              <Button onClick={() => submitReview()} type="submit">Submit Review</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="bg-black p-3 mt-8 flex items-center justify-center">
        <h2 className="text-white">© 2024 Our cakestore. All rights reserved.</h2>
      </div>

    </div>
  );
}
