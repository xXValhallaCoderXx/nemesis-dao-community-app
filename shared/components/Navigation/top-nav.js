import { forwardRef } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import Logo from "../../../shared/images/logo.png";

// eslint-disable-next-line react/display-name
const LinkBehavior = forwardRef((props, ref) => (
  <NextLink ref={ref} href="/" {...props} role={undefined} />
));

const NavigationBar = () => {
  return (
    <AppBar>
      <Toolbar>
        <Image src={Logo} alt="Picture of the author" width={40} height={40} />
        <Typography
          variant="h6"
          style={{ color: "#d8cab9", textDecoration: "none" }}
          sx={{ marginLeft: 3, flexGrow: 1, marginTop: 0.5 }}
        >
          Home
        </Typography>
        <LinkContainer>
          <Link
            style={{ color: "#d8cab9", textDecoration: "none" }}
            href="/calculator"
          >
            <Typography variant="h6" component="div">
              Calculator
            </Typography>
          </Link>

          <Link
            style={{ color: "#d8cab9", textDecoration: "none" }}
            href="/faq"
          >
            <Typography variant="h6" component="div">
              Faq
            </Typography>
          </Link>
        </LinkContainer>
      </Toolbar>
    </AppBar>
  );
};

const HomeLink = styled(Link)`
  font-size: 20px;
  letter-spacing: 1px;
`;

const StyledLink = styled(Link)`
  margin-right: 15px;
  font-size: 20px;
  letter-spacing: 1px;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 200px;
`;

export default NavigationBar;
