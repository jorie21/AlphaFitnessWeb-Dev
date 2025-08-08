import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Check, RefreshCcw } from "lucide-react"
import { keycardFeature, keycardRenew } from "@/constant/features"

export default function KeycardsPage() {
  return (
    <section className="screen flex flex-col justify-center items-center gap-8 px-4 sm:px-8 ">
      
      {/* Heading */}
      <div className="text-center space-y-2 max-w-xl">
        <h1 className="font-russo text-3xl sm:text-4xl leading-tight">
          Get Your Alpha Fitness KeyCard
        </h1>
        <p className="text-base sm:text-lg leading-relaxed font-arone opacity-70">
          Required for all services. Choose your keycard option below.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-6 sm:gap-8 max-w-5xl">
        
        {/* Basic Keycard */}
        <Card className="relative flex flex-col justify-between overflow-hidden border-2 border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-xl w-fit shadow-sm">
              <CreditCard className="h-8 w-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl font-russo">Basic Keycard</CardTitle>
            <CardDescription className="text-sm opacity-70 px-2">
              Get your Alpha Fitness keycard without any services loaded
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            {/* Price */}
            <div className="space-y-1">
              <div className="text-4xl font-bold text-gray-900">₱150</div>
              <p className="text-sm text-gray-500">One-time fee</p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {keycardFeature.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="pt-4">
            <Button className="w-full bg-gray-700 hover:bg-transparent border hover:border-gray-700 hover:text-gray-700 text-white font-medium py-3 rounded-lg">
              Get Basic Keycard
            </Button>
          </CardFooter>
        </Card>

        {/* Renew Keycard */}
        <Card className="relative flex flex-col justify-between overflow-hidden border-2 border-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit shadow-sm">
              <RefreshCcw className="h-8 w-8 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-russo">Renew Keycard</CardTitle>
            <CardDescription className="text-sm opacity-70 px-2">
              Renew your existing Alpha Fitness keycard
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            {/* Price */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">One-time fee</p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {keycardRenew.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="pt-4">
            <Button variant="secondary" className="w-full font-arone text-white font-medium py-3">
              Renew Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
