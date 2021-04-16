import React from "react";

import styled, { css, keyframes } from "styled-components";
import {Section, Content, Item, ItemH, ItemBreak, A, B, H1, H2, H3, Image, P, Span, Anchor, Button, Showoff, FormSubmision, Input, TextField} from 'components/SharedStyling';

import { BsChevronExpand } from 'react-icons/bs';

import { AnimateOnChange } from "react-animation";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";

import { addresses, abis } from "@project/contracts";
import { useWeb3React } from "@web3-react/core";
import YieldFarmingDataStore from "singletons/YieldFarmingDataStore";
import PoolCard from "components/PoolCard";

const ethers = require("ethers");

// Create Header
function YieldFarming() {
  const { active, error, account, library, chainId } = useWeb3React();

  const [poolStats, setPoolStats] = React.useState(null);
  const [pushPoolStats, setPushPoolStats] = React.useState(null);
  const [lpPoolStats, setLpPoolStats] = React.useState(null);
  const [userDataPUSH, setUserDataPUSH] = React.useState(null);
  const [userDataLP, setUserDataLP] = React.useState(null);

  const [formattedDuration, setFormattedDuration] = React.useState("");

  const [epnsToken, setEpnsToken] = React.useState(null);
  const [staking, setStaking] = React.useState(null);
  const [yieldFarmingPUSH, setYieldFarmingPUSH] = React.useState(null);
  const [yieldFarmingLP, setYieldFarmingLP] = React.useState(null);
  const [uniswapV2Router02, setUniswapV2Router02] = React.useState(null);

  const [showAnswers, setShowAnswers] = React.useState([]);

  const toggleShowAnswer = (id) => {
    let newShowAnswers = [...showAnswers];
    newShowAnswers[id] = !newShowAnswers[id];

    setShowAnswers(newShowAnswers);
  }

  const getPoolStats = React.useCallback(async () => {
    const poolStats = await YieldFarmingDataStore.instance.getPoolStats();

    setPoolStats({ ...poolStats });
  }, [epnsToken, staking, yieldFarmingPUSH, yieldFarmingLP, uniswapV2Router02]);

  const getPUSHPoolStats = React.useCallback(async () => {
    const pushPoolStats = await YieldFarmingDataStore.instance.getPUSHPoolStats();

    setPushPoolStats({ ...pushPoolStats });
  }, [epnsToken, staking, yieldFarmingPUSH, yieldFarmingLP, uniswapV2Router02]);

  const getLPPoolStats = React.useCallback(async () => {
    const lpPoolStats = await YieldFarmingDataStore.instance.getLPPoolStats();

    setLpPoolStats({ ...lpPoolStats });
  }, [epnsToken, staking, yieldFarmingPUSH, yieldFarmingLP, uniswapV2Router02]);

  const getUserDataPUSH = React.useCallback(async () => {
    const userDataPUSH = await YieldFarmingDataStore.instance.getUserData(yieldFarmingPUSH);

    setUserDataPUSH({ ...userDataPUSH });
  }, [yieldFarmingPUSH]);

  const getUserDataLP = React.useCallback(async () => {
    const userDataLP = await YieldFarmingDataStore.instance.getUserData(yieldFarmingLP);

    setUserDataLP({ ...userDataLP });
  }, [yieldFarmingLP]);

  const formatTokens = (tokens) => {
    if (tokens) {
      return tokens.div(ethers.BigNumber.from(10).pow(18)).toString();
    }
  };

  const getFormattedDuration = () => {
    if (poolStats?.epochEndTimestamp) {
      const epochEndTimestamp = poolStats.epochEndTimestamp.toNumber();

      const duration = epochEndTimestamp - Math.floor(new Date() / 1000);
      const day = parseInt(duration / 86400);
      const hour = parseInt((duration - day * 86400) / 3600);

      const minutes = parseInt((duration - (day * 86400 + hour * 3600)) / 60);
      const seconds = duration - (day * 86400 + hour * 3600 + minutes * 60);

      setFormattedDuration(`${day}D ${hour}H ${minutes}M ${seconds}S`);
    }
  };

  React.useEffect(() => {
    setTimeout(() => {
      getFormattedDuration();
    }, 1000);
  });

  React.useEffect(() => {
    let epnsToken = new ethers.Contract(
      addresses.epnsToken,
      abis.epnsToken,
      library
    );
    let staking = new ethers.Contract(addresses.staking, abis.staking, library);
    let yieldFarmingPUSH = new ethers.Contract(
      addresses.yieldFarmPUSH,
      abis.yieldFarming,
      library
    );

    let yieldFarmingLP = new ethers.Contract(
      addresses.yieldFarmLP,
      abis.yieldFarming,
      library
    );

    let uniswapV2Router02Instance = new ethers.Contract(
      addresses.uniswapV2Router02,
      abis.uniswapV2Router02,
      library
    );

    setEpnsToken(epnsToken);
    setStaking(staking);
    setYieldFarmingPUSH(yieldFarmingPUSH);
    setYieldFarmingLP(yieldFarmingLP);
    setUniswapV2Router02(uniswapV2Router02Instance)

    if (!!(library && account)) {
      var signer = library.getSigner(account);

      let epnsToken = new ethers.Contract(
        addresses.epnsToken,
        abis.epnsToken,
        signer
      );
      let staking = new ethers.Contract(
        addresses.staking,
        abis.staking,
        signer
      );
      let yieldFarmingPUSH = new ethers.Contract(
        addresses.yieldFarmPUSH,
        abis.yieldFarming,
        signer
      );
      let yieldFarmingLP = new ethers.Contract(
        addresses.yieldFarmLP,
        abis.yieldFarming,
        signer
      );

      let uniswapV2Router02Instance = new ethers.Contract(
        addresses.uniswapV2Router02,
        abis.uniswapV2Router02,
        signer
      );

      setEpnsToken(epnsToken);
      setStaking(staking);
      setYieldFarmingPUSH(yieldFarmingPUSH);
      setYieldFarmingLP(yieldFarmingLP);
      setUniswapV2Router02(uniswapV2Router02Instance);
  }
  }, [account]);

  React.useEffect(() => {
    if (epnsToken != null && staking != null && yieldFarmingPUSH != null) {
      // Instantiate Data Stores
      YieldFarmingDataStore.instance.init(
        account,
        epnsToken,
        staking,
        yieldFarmingPUSH,
        yieldFarmingLP,
        uniswapV2Router02
      );
      getPoolStats();
      getPUSHPoolStats();
      getLPPoolStats();
      getUserDataPUSH();
      getUserDataLP();
      // setpoolStats(YieldFarmingDataStore.instance.state);
    }
  }, [getPoolStats, getPUSHPoolStats, getLPPoolStats, getUserDataPUSH, getUserDataLP]);

  return (
    <Section>
      {poolStats ? (
        <Content>
          <ItemH margin="0px 0px 15px 0px">
            <StatsCard>
              <Heading>Total Value Locked</Heading>
              <SubHeading>{`$ ${parseInt(formatTokens(poolStats.nextPoolSize)) *
                poolStats.pushPrice}`}</SubHeading>
            </StatsCard>
            <StatsCard>
              <Heading>PUSH Rewards</Heading>
              <SubHeading>{formatTokens(poolStats.pushRewardsDistributed)}</SubHeading>
              <p>out of {formatTokens(poolStats.totalDistributedAmount)}</p>
            </StatsCard>
            <StatsCard>
              <Heading>PUSH Price</Heading>
              <SubHeading>{`$ ${poolStats.pushPrice}`}</SubHeading>
              <a href="app.uniswap.org">
                <p>Uniswap market</p>
              </a>
            </StatsCard>
            <StatsCard>
              <Heading>Time Left</Heading>
              <SubHeading>{formattedDuration}</SubHeading>
              <p>until next epoch</p>
            </StatsCard>
          </ItemH>

          <ItemH margin="15px 0px 0px 0px">
            <PoolCard
              poolName={'Uniswap LP Pool (UNI-V2)'}
              poolAddress={addresses.yieldFarmLP}
              tokenAddress={addresses.epnsLPToken}
              getPoolStats={getPoolStats}
              getPUSHPoolStats={getLPPoolStats}
              getUserData={getUserDataLP}
              pushPoolStats={lpPoolStats}
              userData={userDataLP}
            />
            <PoolCard
              poolName={'Staking Pool (PUSH)'}
              poolAddress={addresses.yieldFarmPUSH}
              tokenAddress={addresses.epnsToken}
              getPoolStats={getPoolStats}
              getPUSHPoolStats={getPUSHPoolStats}
              getUserData={getUserDataPUSH}
              pushPoolStats={pushPoolStats}
              userData={userDataPUSH}
            />
          </ItemH>
        </Content>
      ) : (
        <Content self="center" align="center">
          <Loader type="Oval" color="#e20880" height={40} width={40} />
        </Content>
      )}
    </Section>
  );
}

// css styles
const Container = styled.div`
  flex: 1;
  display: block;
  flex-direction: column;
  min-height: calc(100vh - 100px);
`;

const StatsContainer = styled.div`
  flex: 0;
  display: flex;
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const StatsCard = styled(Item)`
  padding: 18px;
  min-width: 200px;
  background: #fff;

  box-shadow: 0px 15px 20px -5px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  border: 1px solid rgb(225, 225, 225);

  margin: 10px;

  &:hover {
    opacity: 0.9;
  }
`;

const CenterHeading = styled.h2`
  text-align: center;
`;

const PoolContainer = styled.div`
  display: flex;
`;

const Heading = styled.h5`
  font-weight: 600;
  color: #e20880;
  text-transform: uppercase;
`;

const SubHeading = styled.p`
  font-weight: bold;
  font-size: 20px;
`;

// Export Default
export default YieldFarming;
