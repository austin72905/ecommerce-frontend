import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import Container from '@mui/material/Container';
import Icon from '@mui/material/Icon';
import Divider from '@mui/material/Divider';
import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';


export default function Footer() {
  // npm install @svgr/webpack  svg 要另外下載套件

  const instagramImageBlack = '/images/instagram-gray.svg';
  const instagramImage = '/images/Instagram_logo_2016.svg'
  const [instgramIsHover, setInstgramIsHover] = useState(instagramImageBlack)


  return (
    <Box sx={{ mt: "30px", border: "1px solid #fafafa", backgroundColor: "#fafafa" }}>
      <Container sx={{ marginTop: "30px", border: "0px solid" }}>
        <Container sx={{ border: "0px solid" }} maxWidth='xl'>
          <footer>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} sx={{ m: "20px" }} spacing={"15px"}>
              <p>關於我們</p>
              <IconButton
                sx={{ border: "1px solid #e5e5e5", width: "40px", height: "40px" }}
                onMouseEnter={() => setInstgramIsHover(instagramImage)}
                onMouseLeave={() => setInstgramIsHover(instagramImageBlack)}
                onTouchStart={() => setInstgramIsHover(instagramImage)}
                onTouchEnd={() => setInstgramIsHover(instagramImageBlack)}
              >

                <Icon >
                  <Image src={instgramIsHover} width={25} height={25} style={{ width: "25px", height: "25px" }} alt='instagram' />
                </Icon>

              </IconButton>
            </Stack>


          </footer>
          <Divider />
          <footer>
            <Stack direction={"row"} justifyContent={"center"} sx={{ m: "10px" }} spacing={"5px"}>
              <Typography sx={{ color: "#9c9c9c", fontWeight: "bold" }}>© 2023</Typography>
              <Typography sx={{ color: "#3E8FB2", fontWeight: "bold" }}>ponggoodbf</Typography>
              <Typography sx={{ color: "#9c9c9c", fontWeight: "bold" }}>All Rights Reserved.</Typography>
            </Stack>
            <Stack direction={"row"} justifyContent={"center"} sx={{ m: "10px" }} spacing={"5px"}>
              
                <Link href={"/privacy-policy"} >
                  <Typography variant="subtitle2">
                    隱私權政策
                  </Typography>
                </Link>
              
            </Stack>

          </footer>
        </Container>

      </Container>

    </Box>
  )
}