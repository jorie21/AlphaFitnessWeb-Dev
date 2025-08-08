import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { personalTraining } from "@/constant/services"
import { fitnessCoach } from "@/constant/services"
import coach from '@/public/icons/coach.png'
export default function PersonalTrainingPage() {
  return (
     <section className="screen flex flex-col justify-center items-center gap-8 space-y-5">
      <div className="text-center space-y-2">
        <h1 className="font-russo text-4xl">Personal Training</h1>
        <p className="text-base leading-relaxed max-w-prose font-arone opacity-70">
         Get personalized attention with our expert trainers
        </p>
      </div>
      <span className="font-russo text-2xl ">Package Deals (12 Sessions)</span>
      {/* Package Cards */}
      <div className="flex w-full gap-5">
        {personalTraining.map((training, index) => (  
          <Card key={index} className="relative justify-between w-full p-5 overflow-hidden gradient-border">
        {/* Card Icon */}
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-lg w-fit">
                <Image src={training.logo} alt="gloves" height={50} width={50} />
              </div>
              <CardTitle className="text-2xl  font-russo ">{training.title}</CardTitle>
              
              <CardDescription className="hidden">
                Get your Alpha Fitness keycard without any services loaded
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              {/* Price */}
              <div className="space-y-1 font-arone">
                <div className="text-4xl font-russo text-secondary">{training.price}</div>
                  <p className="text-sm text-primary font-arone">{training.session}</p>
              </div>
              <div className="text-left">
                <Button variant={'ghost'} className={'bg-[#22C55E]/30 border-[#22C55E] border-2 rounded-4xl text-[#16A34A]'} size={'sm'}>{training.perSession}</Button>
              </div>
            <div className="space-y-3">
              {training.features?.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-left">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            </CardContent>
            <CardFooter className="pt-4">
              <div className="flex justify-between items-center w-full">
                  <div className="flex-1 w-fulll">
                    <Button  variant={'secondary'} className={'text-white w-full'}>Book Package</Button>
                  </div>
              </div>
             
            </CardFooter>
          </Card>
        ))}
      </div>
      <span className="font-russo text-2xl ">Per Session Rates</span>
      {/* Per Session Cards */}
      <div className="flex w-full gap-5">
        {personalTraining.map((training, m) => (
          <Card key={m} className={'gradient-border w-full'}>
            <CardHeader className={'text-center'}>
              <CardTitle className={'font-russo text-2xl'}>{training.title}</CardTitle>
              <CardDescription className={'hidden'} >hello</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col  items-center">
                  <span className="text-4xl font-russo text-secondary">{training.price}</span>
                  <span className="text-primary font-arone">Per Session</span>
                  <span className="text-secondary font-arone font-semibold mt-5">Perfect for beginners</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <div className="flex justify-between items-center w-full">
                  <div className="flex-1 w-fulll">
                    <Button  variant={'outlineSecondary'} className={'text-secondary w-full'}>Book Package</Button>
                  </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <span className="font-russo text-2xl ">Fitness Training Coach</span>
      {/* FitnessCoach */}
      <div className="flex w-full gap-5">
         {fitnessCoach.map((fit, i) => (
          <Card key={i} className={'gradientBlue-border w-full p-5'}>
             <CardHeader className={'place-items-center'}>
               <div className="mx-auto mb-4 p-3 rounded-lg w-fit">
                <Image src={coach} alt="coach" width={50} height={50}/>
               </div>
                <CardTitle className={'font-russo text-2xl'}>{fit.session}</CardTitle>
              </CardHeader> 
              <CardContent  className="text-center space-y-6">
                <span className="text-4xl font-russo text-secondary">{fit.price}</span>
                  <p className="text-sm text-Blue font-arone">Try it Out</p>

              </CardContent>
          </Card>
         ))} 
      </div>
    </section>
  )
}
