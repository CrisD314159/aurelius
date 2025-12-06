import * as motion from "motion/react-client"

export default function Keyframes() {

    const box = {
        width: 100,
        height: 100,
        backgroundColor: "#f5f5f5",
        borderRadius: 5,
    }
    return (
        <motion.div
            animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "0%"],
            }}
            transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1,
            }}
            style={box}
        />
    )
}


