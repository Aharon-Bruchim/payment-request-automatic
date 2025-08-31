import { Box } from "@mui/material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function Spinner() {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DotLottieReact
        src="/violin-music.lottie"
        loop
        autoplay
        style={{ width: 350, height: 350 }}
      />
    </Box>
  );
}
