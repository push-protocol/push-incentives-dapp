import React from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";


import styled, { css, keyframes } from "styled-components";
import {Section, Content, Item, ItemH, ItemBreak, A, B, H1, H2, H3, Image, P, Span, Anchor, Button, Showoff, FormSubmision, Input, TextField} from 'components/SharedStyling';

import { addresses, abis } from "@project/contracts";
import { ToastContainer, toast } from "react-toastify";

import { AnimateOnChange } from "react-animation";
import Loader from "react-loader-spinner";
import Blockies from "components/BlockiesIdenticon";
//   <Blockies opts={{seed: "foo", color: "#dfe", bgcolor: "#a71", size: 15, scale: 3, spotcolor: "#000"}}/>
const ethers = require("ethers");

// Create Header
export default function PoolCard({
  poolName,
  poolAddress,
  tokenAddress,
  getPoolStats,
  getPUSHPoolStats,
  getUserData,
  pushPoolStats,
  userData,
}) {
  const { active, error, account, library, chainId } = useWeb3React();
  const [depositAmountToken, setDepositAmountToken] = React.useState(0);
  const [withdrawAmountToken, setWithdrawAmountToken] = React.useState(0);
  const [harvestEpochValue, setHarvestEpochValue] = React.useState(0);
  const [txInProgress, setTxInProgress] = React.useState(false);

  const [showDepositItem, setShowDepositItem] = React.useState(false);

  const [depositApproved, setDepositApprove] = React.useState(false);
  const [txInProgressApprDep, setTxInProgressApprDep] = React.useState(false);

  const [txInProgressDep, setTxInProgressDep] = React.useState(false);

  // React.useEffect(() => {
  //   setTxInProgressApprDep(true);
  //
  //   // Check if the account has approved deposit
  //   var signer = library.getSigner(account);
  //   let epnsToken = new ethers.Contract(tokenAddress, abis.epnsToken, signer);
  //   let staking = new ethers.Contract(addresses.staking, abis.staking, signer);
  //
  //
  //
  // }, [account]);

  const approveDeposit = async () => {
    if (depositApproved || txInProgressApprDep) {
      return
    }

    setTxInProgressApprDep(true);

    var signer = library.getSigner(account);
    let epnsToken = new ethers.Contract(tokenAddress, abis.epnsToken, signer);
    let staking = new ethers.Contract(addresses.staking, abis.staking, signer);

    const tx = epnsToken.approve(
      staking.address,
      ethers.BigNumber.from(depositAmountToken).mul(
        ethers.BigNumber.from(10).pow(18)
      )
    );

    tx.then(async (tx) => {
      let txToast = toast.dark(
        <LoaderToast msg="Waiting for Confirmation..." color="#35c5f3" />,
        {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      try {
        await library.waitForTransaction(tx.hash);

        toast.update(txToast, {
          render: "Transaction Completed!",
          type: toast.TYPE.SUCCESS,
          autoClose: 5000,
        });
        setTxInProgressApprDep(false);
        setDepositApprove(true);

      } catch (e) {
        toast.update(txToast, {
          render: "Transaction Failed! (" + e.name + ")",
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        });

        setTxInProgressApprDep(false);
      }
    }).catch((err) => {
      toast.dark("Transaction Cancelled!", {
        position: "bottom-right",
        type: toast.TYPE.ERROR,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTxInProgressApprDep(false);
    });
  }

  const depositAmountTokenFarmSingleTx = async () => {
    if (txInProgressDep || !approveDeposit) {
      return
    }

    setTxInProgressDep(true)

    var signer = library.getSigner(account);
    let epnsToken = new ethers.Contract(tokenAddress, abis.epnsToken, signer);
    let staking = new ethers.Contract(addresses.staking, abis.staking, signer);
    console.log(depositAmountToken);

    const tx2 = staking.deposit(
      tokenAddress,
      ethers.BigNumber.from(depositAmountToken).mul(
        ethers.BigNumber.from(10).pow(18)
      )
    );

    tx2
      .then(async (tx) => {
        let txToast = toast.dark(
          <LoaderToast msg="Waiting for Confirmation..." color="#35c5f3" />,
          {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );

        try {
          await library.waitForTransaction(tx.hash);

          toast.update(txToast, {
            render: "Transaction Completed!",
            type: toast.TYPE.SUCCESS,
            autoClose: 5000,
          });

          getPoolStats();
          getPUSHPoolStats();
          getUserData();

          setTxInProgressDep(false);
          window.location.reload();
        } catch (e) {
          toast.update(txToast, {
            render: "Transaction Failed! (" + e.name + ")",
            type: toast.TYPE.ERROR,
            autoClose: 5000,
          });

          setTxInProgressDep(false);
        }
      })
      .catch((err) => {
        toast.dark("Transaction Cancelled!", {
          position: "bottom-right",
          type: toast.TYPE.ERROR,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTxInProgressDep(false);
      });
  };

  const depositAmountTokenFarm = async () => {
    var signer = library.getSigner(account);
    let epnsToken = new ethers.Contract(tokenAddress, abis.epnsToken, signer);
    let staking = new ethers.Contract(addresses.staking, abis.staking, signer);
    console.log(depositAmountToken);
    const tx = epnsToken.approve(
      staking.address,
      ethers.BigNumber.from(depositAmountToken).mul(
        ethers.BigNumber.from(10).pow(18)
      )
    );

    tx.then(async (tx) => {
      let txToast = toast.dark(
        <LoaderToast msg="Waiting for Confirmation..." color="#35c5f3" />,
        {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      try {
        await library.waitForTransaction(tx.hash);

        toast.update(txToast, {
          render: "Transaction Completed!",
          type: toast.TYPE.SUCCESS,
          autoClose: 5000,
        });

        const tx2 = staking.deposit(
          tokenAddress,
          ethers.BigNumber.from(depositAmountToken).mul(
            ethers.BigNumber.from(10).pow(18)
          )
        );

        tx2
          .then(async (tx) => {
            let txToast = toast.dark(
              <LoaderToast msg="Waiting for Confirmation..." color="#35c5f3" />,
              {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );

            try {
              await library.waitForTransaction(tx.hash);

              toast.update(txToast, {
                render: "Transaction Completed!",
                type: toast.TYPE.SUCCESS,
                autoClose: 5000,
              });

              getPoolStats();
              getPUSHPoolStats();
              getUserData();

              setTxInProgress(false);
            } catch (e) {
              toast.update(txToast, {
                render: "Transaction Failed! (" + e.name + ")",
                type: toast.TYPE.ERROR,
                autoClose: 5000,
              });

              setTxInProgress(false);
            }
          })
          .catch((err) => {
            toast.dark("Transaction Cancelled!", {
              position: "bottom-right",
              type: toast.TYPE.ERROR,
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            setTxInProgress(false);
          });

        setTxInProgress(false);
      } catch (e) {
        toast.update(txToast, {
          render: "Transaction Failed! (" + e.name + ")",
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        });

        setTxInProgress(false);
      }
    }).catch((err) => {
      toast.dark("Transaction Cancelled!", {
        position: "bottom-right",
        type: toast.TYPE.ERROR,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTxInProgress(false);
    });
  };

  const withdrawAmountTokenFarm = async () => {
    var signer = library.getSigner(account);
    let staking = new ethers.Contract(addresses.staking, abis.staking, signer);

    const tx = staking.withdraw(
      tokenAddress,
      ethers.BigNumber.from(withdrawAmountToken).mul(
        ethers.BigNumber.from(10).pow(18)
      )
    );

    tx.then(async (tx) => {
      let txToast = toast.dark(
        <LoaderToast msg="Waiting for Confirmation..." color="#35c5f3" />,
        {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      try {
        await library.waitForTransaction(tx.hash);

        toast.update(txToast, {
          render: "Transaction Completed!",
          type: toast.TYPE.SUCCESS,
          autoClose: 5000,
        });

        setTxInProgress(false);
      } catch (e) {
        toast.update(txToast, {
          render: "Transaction Failed! (" + e.name + ")",
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        });

        setTxInProgress(false);
      }
    }).catch((err) => {
      toast.dark("Transaction Cancelled!", {
        position: "bottom-right",
        type: toast.TYPE.ERROR,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTxInProgress(false);
    });

    getPoolStats();
    getPUSHPoolStats();
    getUserData();
  };

  const harvestTokens = async () => {
    var signer = library.getSigner(account);
    let yieldFarmingPUSH = new ethers.Contract(
      poolAddress,
      abis.yieldFarming,
      signer
    );
    if (harvestEpochValue) {
      const tx = yieldFarmingPUSH.harvest(harvestEpochValue);
      tx.then(async (tx) => {
        let txToast = toast.dark(
          <LoaderToast msg="Waiting for Confirmation..." color="#35c5f3" />,
          {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );

        try {
          await library.waitForTransaction(tx.hash);

          toast.update(txToast, {
            render: "Transaction Completed!",
            type: toast.TYPE.SUCCESS,
            autoClose: 5000,
          });

          setTxInProgress(false);
        } catch (e) {
          toast.update(txToast, {
            render: "Transaction Failed! (" + e.name + ")",
            type: toast.TYPE.ERROR,
            autoClose: 5000,
          });

          setTxInProgress(false);
        }
      }).catch((err) => {
        toast.dark("Transaction Cancelled!", {
          position: "bottom-right",
          type: toast.TYPE.ERROR,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTxInProgress(false);
      });
    }
  };

  const massHarvestTokens = async () => {
    var signer = library.getSigner(account);
    let yieldFarmingPUSH = new ethers.Contract(
      poolAddress,
      abis.yieldFarming,
      signer
    );
    const tx = yieldFarmingPUSH.massHarvest();
    tx.then(async (tx) => {
      let txToast = toast.dark(
        <LoaderToast msg="Waiting for Confirmation..." color="#35c5f3" />,
        {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      try {
        await library.waitForTransaction(tx.hash);

        toast.update(txToast, {
          render: "Transaction Completed!",
          type: toast.TYPE.SUCCESS,
          autoClose: 5000,
        });

        setTxInProgress(false);
      } catch (e) {
        toast.update(txToast, {
          render: "Transaction Failed! (" + e.name + ")",
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        });

        setTxInProgress(false);
      }
    }).catch((err) => {
      toast.dark("Transaction Cancelled!", {
        position: "bottom-right",
        type: toast.TYPE.ERROR,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTxInProgress(false);
    });
  };

  const formatTokens = (tokens) => {
    if (tokens) {
      return tokens.div(ethers.BigNumber.from(10).pow(18)).toString();
    }
  };

  return (
    <Section>
      <Content>
        <Item margin="20px" padding="0px 20px 0px 10px" border="1px solid #e1e1e1" radius="12px">
          <Item align="flex-start">
            <H2 textTransform="uppercase" spacing="0.1em">
              <Span bg={poolName == "Uniswap LP Pool (UNI-V2)" ? "#35c5f3" : "#e20880"} size="0.8em" color="#fff" weight="600" padding="0px 8px">{poolName}</Span>
            </H2>
            {userData.userPUSHStakeBalance != 0 &&
              <H3>Your Stake Balance - <b>{formatTokens(userData.epochStakeNext)}</b></H3>
            }
          </Item>

          <Item align="stretch" self="stretch">
            <ItemH margin="0px">
              <Item bg="#000" margin="5px 10px" radius="12px">
                <PoolBoxTitle>EPOCH</PoolBoxTitle>
                <PoolBoxMsg>{pushPoolStats.currentEpochPUSH.toString()}/
                {pushPoolStats.totalEpochPUSH}</PoolBoxMsg>
              </Item>

              <Item bg="#000" margin="5px 10px" radius="12px">
                <PoolBoxTitle>Current EPOCH Reward</PoolBoxTitle>
                <PoolBoxMsg>{formatTokens(pushPoolStats.rewardForCurrentEpoch)} PUSH</PoolBoxMsg>
              </Item>
            </ItemH>
            <ItemH margin="0px">
              <Item bg="#000" margin="5px 10px" radius="12px">
                <PoolBoxTitle>User Expected Reward</PoolBoxTitle>
                <PoolBoxMsg>{formatTokens(userData.potentialUserReward)} PUSH</PoolBoxMsg>
              </Item>

              <Item bg="#000" margin="5px 10px" radius="12px">
                <PoolBoxTitle>User Pool Balance</PoolBoxTitle>
                <PoolBoxMsg>{formatTokens(userData.epochStakeNext)}</PoolBoxMsg>
              </Item>
            </ItemH>
          </Item>

          {showDepositItem &&
            <Item bg="#ddd" radius="12px" margin="20px 0px -10px 0px" padding="10px 20px" align="stretch" self="stretch">
              <Input
                placeholder="Number of Tokens"
                disabled={depositApproved ? true : false}
                radius="4px"
                padding="12px"
                bg="#fff"
                value={depositAmountToken}
                onChange={(e) => {setDepositAmountToken(e.target.value)}}
              />
              <ItemH>
                <ButtonAlt
                  bg={depositApproved ? "#999" : "#e20880"}
                  onClick={approveDeposit}
                  disabled={depositApproved ? true : false}
                >
                  {!depositApproved && !txInProgressApprDep &&
                    <Span color="#fff" weight="400">Approve</Span>
                  }
                  {txInProgressApprDep && !depositApproved &&
                    <Loader
                      type="Oval"
                      color="#fff"
                      height={12}
                      width={12}
                    />
                  }
                  {!txInProgress && depositApproved &&
                    <Span color="#fff" weight="600">Approved</Span>
                  }
                </ButtonAlt>
                <ButtonAlt
                  bg={!depositApproved ? "#999" : "#e20880"}
                  disabled={!depositApproved ? true : false}
                  onClick={depositAmountTokenFarmSingleTx}
                >
                  {!txInProgressDep &&
                    <Span color="#fff" weight="400">Deposit</Span>
                  }
                  {txInProgressDep &&
                    <Loader
                      type="Oval"
                      color="#fff"
                      height={12}
                      width={12}
                    />
                  }
                </ButtonAlt>
              </ItemH>
            </Item>
          }

          <ItemH margin="20px 0px 20px 0px" align="stretch" self="stretch">
            {!showDepositItem &&
              <ButtonAlt
                bg="#e20880"
                onClick={() => setShowDepositItem(!showDepositItem)}
              >
                {!txInProgressDep &&
                  <Span color="#fff" weight="400">Deposit</Span>
                }
                {txInProgressApprDep &&
                  <Loader
                    type="Oval"
                    color="#fff"
                    height={12}
                    width={12}
                  />
                }
              </ButtonAlt>
            }

            <ButtonAlt
              bg="#000"
              onClick={() => setShowDepositItem(!withdrawAmountTokenFarm)}
            >
              <Span color="#fff" weight="400">Withdraw</Span>
            </ButtonAlt>

            <ButtonAlt
              bg="#000"
              onClick={() => massHarvestTokens()}
            >
              <Span color="#fff" weight="400">Harvest</Span>
            </ButtonAlt>

          </ItemH>

          {/*}

          <input
            placeholder="Amount"
            onChange={(e) => setDepositAmountToken(e.target.value)}
          />
          <ButtonAlt onClick={depositAmountTokenFarm}>Deposit</ButtonAlt>
          <input
            placeholder="Amount"
            onChange={(e) => setWithdrawAmountToken(e.target.value)}
          />
          <ButtonAlt onClick={withdrawAmountTokenFarm}>Withdraw</ButtonAlt>
            <input
              placeholder="Enter Epoch Id"
              onChange={(e) => setHarvestEpochValue(e.target.value)}
            />
            <ButtonAlt onClick={harvestTokens}>Harvest</ButtonAlt>
            <ButtonAlt onClick={massHarvestTokens}>Mass Harvest</ButtonAlt>
        */}
        </Item>


      </Content>
    </Section>
  );
}

// toast customize
const LoaderToast = ({ msg, color }) => (
  <Toaster>
    <Loader type="Oval" color={color} height={30} width={30} />
    <ToasterMsg>{msg}</ToasterMsg>
  </Toaster>
);

const PoolBoxTitle = styled(Span)`
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  margin: 10px 5px;
  letter-spacing: 0.1em;
`

const PoolBoxMsg = styled(Span)`
  background: #fff;
  font-weight: 600;
  font-size: 12px;
  margin: 10px 5px;
  letter-spacing: 0.1em;
  padding: 4px 15px;
  border-radius: 10px;
  color: #000;
`

const Container = styled.div`
  padding: 18px;
  background: #fff;
  flex: 1;

  box-shadow: 0px 15px 20px -5px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  border: 1px solid rgb(225, 225, 225);

  margin: 10px;

  &:hover {
    opacity: 0.9;
  }
`;

const MainTitle = styled.h2`
  text-transform: uppercase;
`;

const Heading = styled.h5`
  font-weight: 600;
  color: #e20880;
  text-transform: uppercase;
`;

const ButtonAlt = styled(Button)`
  border: 0;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  margin: 10px;
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 400;
  position: relative;
  &:hover {
    opacity: 0.9;
    cursor: pointer;
    pointer: hand;
  }
  &:active {
    opacity: 0.75;
    cursor: pointer;
    pointer: hand;
  }
  ${(props) =>
    props.disabled &&
    css`
      &:hover {
        opacity: 1;
        cursor: default;
        pointer: default;
      }
      &:active {
        opacity: 1;
        cursor: default;
        pointer: default;
      }
    `}
`;

const Toaster = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0px 10px;
`;

const ToasterMsg = styled.div`
  margin: 0px 10px;
`;
