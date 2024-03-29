'use client'

import Button from "@/components/elements/buttons/Button"
import NextImage from "@/components/NextImage"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className='w-full max-w-screen-md px-3 md:px-6 lg:px-12 flex flex-1 flex-col items-center justify-center text-center text-black'>
      <h1 className='uppercase italic mt-8 text-carbon-900 dark:text-white'>
        Something went wrong
      </h1>
      {error && <p className="text-carbon-700 dark:text-carbon-400">{error.message}</p>}
      <Button
        variant='dark'
        rightIcon='octicon:chevron-right-12'
        rightIconClassName='w-4 h-4 md:w-6 md:h-6'
        className='mt-4 text-lg md:text-xl font-semibold'
        size="xl"
        onClick={() => reset()}
      >
        Try again
      </Button>
      <NextImage src='/images/lost.svg'
        alt='client component error'
        width={1000}
        height={1000}
        className='w-full h-full object-contain object-center'
      />
    </div>
  )
}