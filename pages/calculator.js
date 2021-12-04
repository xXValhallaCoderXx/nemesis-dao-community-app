import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Layout from "../shared/components/Layout/layout";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Slider from "@mui/material/Slider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material";
const fontColor = {
  style: { color: "#A2A3A3" },
};

var usdFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

var percentFormat = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 5,
});

function App() {
  // TODO - Use some kind of reducer / state management
  const [nmsPrice, setNmsPrice] = useState(0);
  const [apy, setApy] = useState(0);
  const [yieldRate, setYieldRate] = useState(0);
  const [amount, setAmount] = useState(0);
  const [totalToken, setTotalToken] = useState(0);

  const [purchasePrice, setPurchasePrice] = useState("");

  const [totalNms, setTotalNms] = useState(0);
  const [days, setDays] = useState(30);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // TODO - Move this API call out of UI layer
    axios.get("/api/calculator").then((res) => {
      setNmsPrice(res.data.priceUSD);
    });
  }, []);

  useEffect(() => {
    setPurchasePrice(nmsPrice);
  }, [nmsPrice]);

  useEffect(() => {
    // Handle Yield
    const yieldRate = ((apy / 100 - 1) ** (1 / (3 * 365)) - 1) * 100;
    const totalTokens = 1 * (1 + yieldRate / 100) ** (3 * 30);
    setYieldRate(yieldRate);
    setTotalToken(totalTokens);
  }, [apy]);

  useEffect(() => {
    console.log("PRUCHASE: ", purchasePrice);
    console.log("AMOUNT: ", amount);
    console.log("YIELD: ", yieldRate);
    console.log("DAYS: ", days);
    const amountInNms = amount * (1 + yieldRate) ** (3 * days);
    setTotalNms(amountInNms);
    const nmsParsed = parseFloat(amountInNms.toString().slice(0, 6));
    const priceParsed = parseFloat(purchasePrice);

    console.log("NMS: ", nmsParsed);
    console.log("AMOUNT IN USD: ", priceParsed);
  }, [amount, yieldRate, purchasePrice, days]);

  // TODO - Make this shit into components
  return (
    <Layout>
      <TitleRow>Nemesis Calculator</TitleRow>

      <CalculatorContainer>
        <CardContent>
          <Grid container>
            <Grid item xs={12} md={4}>
              <Typography
                style={{ color: "#A2A3A3" }}
                textAlign="center"
                fontSize={{ xs: 20, md: 22 }}
              >
                Current Nemesis Price
              </Typography>
              <Typography
                textAlign="center"
                fontSize={{ xs: 17, md: 20 }}
                fontWeight={500}
                color="white"
              >
                {usdFormat.format(nmsPrice)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} mt={{ xs: 2, md: 0 }}>
              <Typography
                style={{ color: "#A2A3A3" }}
                textAlign="center"
                fontSize={{ xs: 20, md: 22 }}
              >
                Current APY
              </Typography>
              <Typography
                textAlign="center"
                fontSize={{ xs: 17, md: 20 }}
                fontWeight={500}
                color="white"
              >
                {percentFormat.format(apy / 100)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} mt={{ xs: 2, md: 0 }}>
              <Typography
                style={{ color: "#A2A3A3" }}
                textAlign="center"
                fontSize={{ xs: 20, md: 22 }}
              >
                Current Yield Reward
              </Typography>
              <Typography
                textAlign="center"
                fontSize={{ xs: 17, md: 20 }}
                fontWeight={500}
                color="white"
              >
                {yieldRate ? percentFormat.format(yieldRate / 100) : "0.00%"}
              </Typography>
            </Grid>
            <Grid item xs={12} mt={{ xs: 5, md: 7 }}>
              <Slider
                size="small"
                defaultValue={days}
                valueLabelDisplay="on"
                value={days}
                min={1}
                max={365}
                onChange={(e) => setDays(e.target.value)}
                valueLabelFormat={(value) => <div>{value} Days</div>}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} md={6} mt={{ xs: 0, md: 2 }}>
              <TextField
                label="Current APY (%)"
                placeholder="Enter APY"
                variant="outlined"
                color="secondary"
                focused
                type="number"
                min="0"
                size={matches ? "small" : ""}
                fullWidth
                inputProps={fontColor}
                onChange={(e) => setApy(e.target.value.replace(/,/g, ""))}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <div style={{ color: "#A2A3A3" }}>%</div>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                style={{ marginTop: 20, marginBottom: 20 }}
                label="Reward Yield (%)"
                placeholder="Enter reward yield"
                variant="outlined"
                color="secondary"
                focused
                type="number"
                size={matches ? "small" : ""}
                fullWidth
                value={yieldRate ? yieldRate.toFixed(5) : "0.00"}
                inputProps={fontColor}
                onChange={(e) => setYieldRate(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <div style={{ color: "#A2A3A3" }}>%</div>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="NMS Quantity"
                variant="outlined"
                color="secondary"
                focused
                type="number"
                size={matches ? "small" : ""}
                inputProps={fontColor}
                placeholder="Enter NMS Quantity"
                onChange={(e) => setAmount(e.target.value)}
              />
              <TextField
                style={{ marginTop: 20 }}
                label="NMS Purchase Price ($)"
                placeholder="Enter purchase price"
                variant="outlined"
                color="secondary"
                focused
                type="number"
                fullWidth
                size={matches ? "small" : ""}
                value={purchasePrice}
                inputProps={fontColor}
                onChange={(e) => setPurchasePrice(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <div style={{ color: "#A2A3A3" }}>$</div>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              pl={{ xs: 0, md: 5 }}
              mt={{ xs: 0, md: 2 }}
            >
              <Grid
                item
                xs={12}
                mt={{ xs: 2, md: 0 }}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  fontSize={{ xs: 12, md: 15 }}
                  fontWeight={500}
                  style={{
                    color: "#A2A3A3",
                  }}
                >
                  Your Initial Investment
                </Typography>
                <Typography fontSize={{ xs: 15, md: 17 }} color="white">
                  {usdFormat.format(amount * purchasePrice)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                mt={{ xs: 2, md: 0 }}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  fontSize={{ xs: 10, md: 13 }}
                  fontWeight={500}
                  style={{
                    color: "#A2A3A3",
                  }}
                >
                  NMS Rewards Estimate
                </Typography>
                <Typography fontSize={{ xs: 15, md: 17 }} color="white">
                  {totalToken ? parseFloat(totalNms.toString().slice(0, 6)) : 0}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                mt={{ xs: 2, md: 0 }}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  fontSize={{ xs: 10, md: 13 }}
                  fontWeight={500}
                  style={{
                    color: "#A2A3A3",
                  }}
                >
                  USD Value Estimate
                </Typography>
                <Typography fontSize={{ xs: 15, md: 17 }} color="white">
                  {totalNms
                    ? usdFormat.format(
                        parseFloat(totalNms.toString().slice(0, 6)) *
                          purchasePrice
                      )
                    : "$0.00"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CalculatorContainer>
      {matches ? null : (
        <Typography
          fontWeight={400}
          mt={5}
          fontSize={{ xs: 12, md: 15 }}
          textAlign="center"
          style={{ color: "#A2A3A3" }}
          variant="h6"
        >
          Note: This is in early stages - More features can be added and
          suggestions welcome
        </Typography>
      )}
    </Layout>
  );
}

const NumberTextfield = styled(TextField)`
  webkit-inner-spin-button,
  webkit-outer-spin-button {
    webkit-appearance: none;
  }
`;

const TitleRow = styled.div`
  margin-top: 20px;
  color: ${({ theme }) => theme.palette.secondary.main};
  ${(props) => props.theme.breakpoints.down("md")} {
    display: none;
  }
  ${(props) => props.theme.breakpoints.up("md")} {
    font-size: 50px;
  }
`;

const CalculatorContainer = styled(Card)`
  padding: 10px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  border-radius: 10px;
  ${(props) => props.theme.breakpoints.down("md")} {
    width: 85%;
    margin-top: 30px;
  }
  ${(props) => props.theme.breakpoints.up("md")} {
    width: 800px;
    margin-top: 50px;
  }
`;

export default App;
