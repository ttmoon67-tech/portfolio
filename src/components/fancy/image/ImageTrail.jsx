import * as React from "react"
import { MotionConfig, motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ── Context ────────────────────────────────────────────
const HoverSliderContext = React.createContext(undefined)

function useHoverSliderContext() {
  const context = React.useContext(HoverSliderContext)
  if (context === undefined) {
    throw new Error(
      "useHoverSliderContext must be used within a HoverSliderProvider"
    )
  }
  return context
}

// ── Helpers ────────────────────────────────────────────
function splitText(text) {
  const words = text.split(" ").map((word) => word + " ")
  const characters = words.flatMap((word) => word.split(""))
  return { words, characters }
}

const clipPathVariants = {
  visible: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  hidden: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)",
  },
}

// ── HoverSlider (context provider) ─────────────────────
export const HoverSlider = React.forwardRef(
  ({ children, className, ...props }, ref) => {
    const [activeSlide, setActiveSlide] = React.useState(0)
    const changeSlide = React.useCallback(
      (index) => setActiveSlide(index),
      []
    )
    return (
      <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </HoverSliderContext.Provider>
    )
  }
)
HoverSlider.displayName = "HoverSlider"

// ── TextStaggerHover ───────────────────────────────────
export const TextStaggerHover = React.forwardRef(
  ({ text, index, className, ...props }, ref) => {
    const { activeSlide, changeSlide } = useHoverSliderContext()
    const { characters } = splitText(text)
    const isActive = activeSlide === index

    return (
      <span
        ref={ref}
        className={cn(
          "relative inline-block origin-bottom overflow-hidden cursor-pointer",
          className
        )}
        onMouseEnter={() => changeSlide(index)}
        {...props}
      >
        {characters.map((char, i) => (
          <span
            key={`${char}-${i}`}
            className="relative inline-block overflow-hidden"
          >
            <MotionConfig
              transition={{
                delay: i * 0.025,
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Inactive (bottom layer) */}
              <motion.span
                className="inline-block opacity-20"
                initial={{ y: "0%" }}
                animate={isActive ? { y: "-110%" } : { y: "0%" }}
              >
                {char}
                {char === " " && i < characters.length - 1 && <>&nbsp;</>}
              </motion.span>

              {/* Active (slides in from bottom) */}
              <motion.span
                className="absolute left-0 top-0 inline-block opacity-100"
                initial={{ y: "110%" }}
                animate={isActive ? { y: "0%" } : { y: "110%" }}
              >
                {char}
              </motion.span>
            </MotionConfig>
          </span>
        ))}
      </span>
    )
  }
)
TextStaggerHover.displayName = "TextStaggerHover"

// ── HoverSliderImageWrap ───────────────────────────────
export const HoverSliderImageWrap = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full",
          className
        )}
        {...props}
      />
    )
  }
)
HoverSliderImageWrap.displayName = "HoverSliderImageWrap"

// ── HoverSliderImage ───────────────────────────────────
export const HoverSliderImage = React.forwardRef(
  ({ index, className, src, alt, ...props }, ref) => {
    const { activeSlide } = useHoverSliderContext()
    return (
      <motion.img
        ref={ref}
        src={src}
        alt={alt || ""}
        className={cn("inline-block align-middle object-cover", className)}
        transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
        variants={clipPathVariants}
        animate={activeSlide === index ? "visible" : "hidden"}
        {...props}
      />
    )
  }
)
HoverSliderImage.displayName = "HoverSliderImage"
