import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, UsersRound } from "lucide-react"
import { GroupClasses, timeSlots } from "@/constant/services"

export default function GroupClassesPage() {
  return (
     <section className="screen flex flex-col justify-center items-center gap-8">
      <div className="space-y-8 w-auto">
        <div className="text-center place-items-center space-y-2">
          <h1 className="font-russo text-3xl">Get Your Alpha Fitness KeyCard</h1>
          <p className="text-base leading-relaxed max-w-prose font-arone opacity-70">Required for all services. Choose your keycard option below.</p>
        </div>
        {/* KEY CARDS */}
        <div className="place-content-center">
          <Card className="relative justify-between w-auto p-5 overflow-hidden gradient-border">
        {/* Card Icon */}
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-lg w-fit">
                <UsersRound className="h-8 w-8 text-secondary" />
              </div>
              
              <CardTitle className="text-2xl  font-russo ">
                Group Classes
              </CardTitle>
              
              <CardDescription className="hidden">
                Get your Alpha Fitness keycard without any services loaded
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              {/* Price */}
              <div className="space-y-1 font-arone">
                <div className="text-4xl font-russo text-secondary">₱3,500</div>
                  <p className="text-sm text-gray-500">1 Month Unlimited</p>
                  <p className="text-l font-bold text-black space-y-4">Available Classes:</p>
              </div>

            <div className="flex w-full justify-center gap-4 ">
             {GroupClasses.map((className) => (
                <Button
                  key={className}
                  variant="outline"
                  className="bg-white gradient-border"
                >
                  {className}
                </Button>
              ))}
            </div>
            </CardContent>
            <CardFooter className="pt-4">
              <div className="flex justify-between items-center w-full">
                {/* Time openers */}
                <div className="flex-1 w-full">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2 items-center">
                        <div className="flex gap-2 items-center">
                          <Clock className="h-5 w-5" />
                          <span className="font-arone font-bold">Monday - Saturday:</span>
                        </div>

                        {/* time */}
                          <ul>
                            {timeSlots.map((time, index) => (
                              <li key={index}
                                  className="text-arone opacity-70"
                              >{time}</li>
                            ))}
                          </ul>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Clock className="h-5 w-5"/>
                        <span className="font-arone font-bold">Sunday:</span>
                      </div>
                      <span>By Appointment</span>
                    </div>
                  </div>
                </div>
                  {/* left btn */}
                  <div className="flex-1 w-fulll">
                    <Button  variant={'secondary'} className={'text-white w-full'}>Join Group Classes</Button>
                  </div>
              </div>
             
            </CardFooter>
          </Card>


        </div>
      </div>
    </section>
  )
}
