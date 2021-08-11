import React from "react";
import styled, { css } from 'styled-components';
import {Section, Content, Item, ItemH, ItemBreak, A, B, H1, H2, H3, Image, P, Span, Anchor, Button, Showoff, FormSubmision, Input, TextField} from 'components/SharedStyling';
import Loader from 'react-loader-spinner'
import { Waypoint } from "react-waypoint";
import { BsChevronExpand } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';

import { useWeb3React } from '@web3-react/core'
import { addresses, abis } from "@project/contracts";
import EPNSCoreHelper from 'helpers/EPNSCoreHelper';
import { ethers } from "ethers";

import DisplayNotice from "components/DisplayNotice";
import ViewDelegateeItem from "components/ViewDelegateeItem";

import ChannelsDataStore, { ChannelEvents } from "singletons/ChannelsDataStore";
import UsersDataStore, { UserEvents } from "singletons/UsersDataStore";
const delegateesJSON = require("config/delegatees.json")

// Create Header
function Delegate({ epnsReadProvider, epnsWriteProvide }) {
  const { account, library } = useWeb3React();
  const [ txInProgress, setTxInProgress ] = React.useState(false);
  const [controlAt, setControlAt] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [owner, setOwner] = React.useState(null);
  const [delegateesObject, setDelegateesObject] = React.useState({});
  const [epnsToken, setEpnsToken] = React.useState(null);
  const [tokenBalance, setTokenBalance] = React.useState(null);
  const [prettyTokenBalance, setPrettyTokenBalance] = React.useState(null);
  const [delegatee, setDelegatee] = React.useState(null);
  const [showAnswers, setShowAnswers] = React.useState([]);
  const [selfVotingPower, setSelfVotingPower ] = React.useState(null);
  const [newDelegateeAddress, setNewDelegateeAddress ] = React.useState(0);
  const [newDelegateeVotingPower, setNewDelegateeVotingPower ] = React.useState(null);

  const toggleShowAnswer = (id) => {
    let newShowAnswers = [...showAnswers];
    newShowAnswers[id] = !newShowAnswers[id];
    setShowAnswers(newShowAnswers);
  }

  React.useEffect(() => {
    console.log(account)
    if (!!(library && account)) {
      let signer = library.getSigner(account);
      const epnsTokenContract = new ethers.Contract(addresses.epnsToken, abis.epnsToken, signer);
      setEpnsToken(epnsTokenContract);
    }
  }, [account,library]);

  React.useEffect(() => {
    if(epnsToken){
      getMyInfo()
    }
  }, [epnsToken,account,library, prettyTokenBalance, tokenBalance]);

  React.useEffect(() => {
    setDelegateesObject(delegateesJSON)
    setLoading(false);
  }, [account]);

  const isValidAddress = async (address) => {
    if(address){
      return await ethers.utils.isAddress(address)
    }
    else{
      toast.dark("Invalid address!", {
        position: "bottom-right",
        type: toast.TYPE.ERROR,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  }

  const getVotingPower = async (address) => {
    try{
      const isAddress = await isValidAddress(address)
      if(isAddress){
        let decimals =  await epnsToken.decimals()
        let votes = await epnsToken.getCurrentVotes(address)
        let votingPower = await Number(votes/Math.pow(10, decimals))
        let prettyVotingPower = parseFloat(votingPower.toLocaleString()).toFixed(3);
        setNewDelegateeVotingPower(votingPower)
      }
    }
    catch(err){
    console.log("🚀 ~ file: Delegate.tsx ~ line 86 ~ getVotingPower ~ err", err)
    }
  }

  const getMyInfo = async () => {
    let bal = await epnsToken.balanceOf(account)
    let decimals =  await epnsToken.decimals()
    let tokenBalance = await Number(bal/Math.pow(10, decimals))
    let newBal = parseFloat(tokenBalance.toLocaleString()).toFixed(3);
    let delegatee = await epnsToken.delegates(account)
    let votes = await epnsToken.getCurrentVotes(account)
    let votingPower = await Number(votes/Math.pow(10, decimals))
    let prettyVotingPower = parseFloat(votingPower.toLocaleString()).toFixed(3);
    setTokenBalance(tokenBalance)
    setPrettyTokenBalance(newBal)
    setDelegatee(delegatee)
    setSelfVotingPower(prettyVotingPower)
  }

  const delegateAction = async (newDelegatee) => {
    setTxInProgress(true);
    const isAddress = await isValidAddress(newDelegatee)
    if(!isAddress){
      toast.dark("Invalid address!", {
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
      return;
    }
    if (tokenBalance == 0) {
      toast.dark("No PUSH to Delegate!", {
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
      return;
    }
    
    let sendWithTxPromise;
    sendWithTxPromise = epnsToken.delegate(newDelegatee);
    sendWithTxPromise
      .then(async tx => {

        let txToast = toast.dark(<LoaderToast msg="Waiting for Confirmation..." color="#35c5f3"/>, {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        try {
          await library.waitForTransaction(tx.hash);

          toast.update(txToast, {
            render: "Transaction Completed!",
            type: toast.TYPE.SUCCESS,
            autoClose: 5000
          });

          setTxInProgress(false);
        }
        catch(e) {
          toast.update(txToast, {
            render: "Transaction Failed! (" + e.name + ")",
            type: toast.TYPE.ERROR,
            autoClose: 5000
          });

          setTxInProgress(false);
        }
      })
      .catch(err => {
        toast.dark('Transaction Cancelled!', {
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
      })
  }

  

  // handle user action at control center
  const userClickedAt = (controlIndex) => {
    setControlAt(controlIndex);
  }

  // toast customize
  const LoaderToast = ({ msg, color }) => (
    <Toaster>
      <Loader
       type="Oval"
       color={color}
       height={30}
       width={30}
      />
      <ToasterMsg>{msg}</ToasterMsg>
    </Toaster>
  )

  return (
    <>
    <Section align="center">
    <H2 textTransform="uppercase" spacing="0.1em">
      <Span bg="#35c5f3" color="#fff" weight="600" padding="0px 8px">Delegate</Span><Span weight="200"> to PUSHers</Span>
    </H2> 
    {!loading && prettyTokenBalance && selfVotingPower &&
    <>
      <ItemH margin="0px 15px 0px 15px" align="left">
        <StatsCard
          align = 'left'
          bg="#fff"
        >
          <StatsHeading bg="#e20880">My Info</StatsHeading>
          <StatsContent>
            <StatsInnerTitle>Push Balance: {prettyTokenBalance}</StatsInnerTitle>
            <StatsInnerTitle>Voting Power: {selfVotingPower}</StatsInnerTitle>
            {delegatee !== "0x0000000000000000000000000000000000000000" &&
              <StatsInnerTitle>Delegated to: {delegatee}</StatsInnerTitle>
            }
            <Item align='left'>
            <UnsubscribeButton >
            <ActionTitle onClick={() => { delegateAction(account)
            }}
              >Delegate to myself</ActionTitle>
            </UnsubscribeButton>
            </Item>
          </StatsContent>
          <StatsPreview color="#e20880">MY INFO</StatsPreview>
        </StatsCard>

        <StatsCard
          align = 'left'
          bg="#fff"
        >
          <StatsHeading bg="#e20880">DELEGATE</StatsHeading>
          <StatsContent>
            <Item bg="#ddd" radius="12px" margin="20px 0px -10px 0px" padding="10px 20px" align="stretch" self="stretch">
              <Span color="#e20880" weight="400">Enter delegatee address</Span><br></br>
              <Input
                placeholder="Enter delegatee address"
                radius="4px"
                padding="12px"
                self="stretch"
                bg="#fff"
                value={newDelegateeAddress}
                onChange={async(e) => {
                  setNewDelegateeAddress(e.target.value)
                  setNewDelegateeVotingPower(null)
                  console.log("🚀 ~ file: Delegate.tsx ~ line 247 ~ Delegate ~ e.target.value", e.target.value)
                }}
              />
              {newDelegateeVotingPower && newDelegateeAddress &&
                <>
                {/* <StatsInnerTitle>Address: {newDelegateeAddress}</StatsInnerTitle> */}
                <StatsInnerTitle>Voting Power: {newDelegateeVotingPower}</StatsInnerTitle>
                </>
              }
              <ItemH>
                <ButtonAlt
                  bg={"#e20880"}
                  onClick={() => { getVotingPower(newDelegateeAddress)
                  }}
                >
                <Span color="#fff" weight="400">Get Voting Power</Span>
                </ButtonAlt>
                <ButtonAlt
                  bg={txInProgress ? "#999" : "#e20880"}
                  disabled={txInProgress ? true : false}
                  onClick={() => { delegateAction(newDelegateeAddress)
                  }}
                  >
                  <Span color="#fff" weight="400">Delegate</Span>
                </ButtonAlt>
              </ItemH>
            </Item>
          </StatsContent>
        </StatsCard>
      </ItemH>
      </>
    }
      
    <br></br>
    {loading &&
      <ContainerInfo>
        <Loader
          type="Oval"
          color="#35c5f3"
          height={40}
          width={40}
        />
      </ContainerInfo>
    }
    {!loading && controlAt == 0 && 
      <ItemH id="scrollstyle-secondary">
        {Object.keys(delegateesObject).map(index => {
            return (
              <>
              <ViewDelegateeItem
                key={delegateesObject[index].wallet}
                delegateeObject={delegateesObject[index]}
                epnsToken={epnsToken}
                pushBalance={tokenBalance}
              />
              </>
            );
          
        })}
      </ItemH>
    }
    </Section>
    {/* FAQs */}
    <Section theme="#fcfcfc" padding="0px 0px 0px 0px">
        <Content className="contentBox">
          <Item align="stretch" justify="flex-start" margin="-10px 20px 0px 20px">

            {/* Question */}
            <Item align="stretch" margin="0px 0px 0px 0px">
              <QnAItem>
                <Question
                  onClick={() => {toggleShowAnswer(1)}}
                  hover="#e20880"
                >
                  <Span>
                    Who are PUSHERS?
                  </Span>
                  <BsChevronExpand size={20} color={"#ddd"}/>
                </Question>

                {showAnswers[1] &&
                  <Answer>
                    <Span>A key part of our decentralization is making sure the community feels empowered. 
                      PUSHers are active community members who strongly align with our mission to build a protocol for blockchain based notifications 
                      that are platform agnostic and incentivized, and have shown time and time again their willingness to take a role in the EPNS ecosystem. 
                      PUSHers will allow EPNS to accelerate our decentralization, eventually turning all governance over to the community.</Span>
                  </Answer>
                }
              </QnAItem>

              <QnAItem>
                <Question
                  onClick={() => {toggleShowAnswer(2)}}
                  hover="#e20880"
                >
                  <Span>
                    How can one become a PUSHER?
                  </Span>
                  <BsChevronExpand size={20} color={"#ddd"}/>
                </Question>

                {showAnswers[2] &&
                  <Answer>
                    <Span></Span>

                    <Span>To become a PUSHER visit <AMod href="https://gov.epns.io/" target="_blank" title="Join our EPNS's Telegram channel">EPNS Governance Portal</AMod> and introduce yoursef on the platform in the suggested format.</Span>
                    <Span>Criteria to become a PUSHER:</Span>
                    <Span>1.</Span>
                    <Span>2.</Span>
                    <Span>3.</Span>
                  </Answer>
                }
              </QnAItem>

              <QnAItem>
                <Question
                  onClick={() => {toggleShowAnswer(3)}}
                  hover="#e20880"
                >
                  <Span>
                    Where should I start?
                  </Span>
                  <BsChevronExpand size={20} color={"#ddd"}/>
                </Question>

                {showAnswers[3] &&
                  <Answer>
                    <Span>Visit <AMod href="https://gov.epns.io/" target="_blank" title="Join our EPNS's Telegram channel">EPNS Governance Portal</AMod> and introduce yoursef on the platform in the suggested format.</Span>

                  </Answer>
                }
              </QnAItem>

              <QnAItem>
                <Question
                  onClick={() => {toggleShowAnswer(4)}}
                  hover="#e20880"
                >
                  <Span>
                    What happens to the delegated voting power when I sell my PUSH tokens?
                  </Span>
                  <BsChevronExpand size={20} color={"#ddd"}/>
                </Question>

                {showAnswers[4] &&
                  <Answer>
                    <Span>If you have delegated your voting power to someone/yourself and later you sold your
                      PUSH tokens, then the voting power gets delegated to the new owner of PUSH tokens. </Span>

                  </Answer>
                }
              </QnAItem>

              <QnAItem>
                <Question
                  onClick={() => {toggleShowAnswer(5)}}
                  hover="#e20880"
                >
                  <Span>
                    How can I cast my vote?
                  </Span>
                  <BsChevronExpand size={20} color={"#ddd"}/>
                </Question>

                {showAnswers[5] &&
                  <Answer>
                    <Span>Please visit <AMod href="https://snapshot.org/#/epns.eth" target="_blank" title="EPNS Governance - Snapshot Portal">EPNS Governance - Snapshot Portal</AMod> to view the ongoing on-chain proposals and cast your vote.</Span>
                  </Answer>
                }
              </QnAItem>

              <QnAItem>
                <Question
                  onClick={() => {toggleShowAnswer(6)}}
                  hover="#e20880"
                >
                  <Span>
                    How can I keep up with EPNS Governance?
                  </Span>
                  <BsChevronExpand size={20} color={"#ddd"}/>
                </Question>

                {showAnswers[6] &&
                  <Answer>
                    <Span>Join our <AMod href="https://t.me/epnsproject" target="_blank" title="Join our EPNS's Telegram channel">Telegram</AMod>, follow us on <AMod href="https://twitter.com/epnsproject" target="_blank" title="Join our EPNS's Twitter channel">Twitter</AMod>, and sign up for our 5 minute <AMod href="https://epns.substack.com/" target="_blank" title="Join our EPNS's Twitter channel">weekly product updates</AMod>.</Span>
                  </Answer>
                }
              </QnAItem>


            </Item>
          </Item>
        </Content>
      </Section>
    </>
  );
}

// css styles
const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  font-weight: 200;
  align-content: center;
  align-items: center;
  justify-content: center;

  max-height: 80vh;
`

const ContainerInfo = styled.div`
  padding: 20px;
`

const Items = styled.div`
  display: block;
  align-self: stretch;
  padding: 10px 20px;
  overflow-y: scroll;
  background: #fafafa;
`
const Question = styled(Button)`
  align-items: stretch;
  align-self: stretch;
`
const Answer = styled(Item)`
  align-items: stretch;
  align-self: stretch;

`

const QnAItem = styled(Item)`
  align-items: stretch;
  align-self: stretch;
  margin: 15px 0px;
  border: 1px solid #fafafa;
  border-radius: 10px;
  box-shadow: 0px 5px 20px -10px rgb(0 0 0 / 0.20);
  overflow: hidden;

  & ${Question} {
    background: transparent;
    justify-content: flex-start;
    text-transform: uppercase;

    & ${Span} {
      font-weight: 400;
      letter-spacing: 0.2em;
      margin-left: 10px;
      flex: 1;
    }

    &:hover {
      & ${Span} {
        color: #fff;
      }
    }
  }

  & ${Answer} {
    border: 1px solid #e6e6e6;
    border-top: 1px solid #e6e6e6;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding: 10px 15px;
    align-items: flex-start;
    background: #fff;

    & ${Span} {
      line-height: 1.5em;
      margin: 10px;
      color: #000 ;
      font-size: 1.05em;
    }
  }
`

const AMod = styled(A)`
  color: #e20880;
  font-weight: 500;
`

const EpicButton = styled(A)`
  padding: 15px 15px;
  margin-left: 25px;
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(273deg, #674c9f 0%, rgba(226,8,128,1) 100%);
  `
  const ChannelActionButton = styled.button`
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
  font-weight: 800;
  // font-weight: 400;
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
  ${ props => props.disabled && css`
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
`
  const UnsubscribeButton = styled(ChannelActionButton)`
  // background: #674c9f;
  background: linear-gradient(273deg, #674c9f 0%, rgba(226,8,128,1) 100%);
  `
  const ActionTitle = styled.span`
  ${ props => props.hideit && css`
    visibility: hidden;
  `};
`
const Toaster = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0px 10px;
`

const ToasterMsg = styled.div`
  margin: 0px 10px;
`
const StatsCard = styled(Item)`
  overflow: hidden;
  min-width: 180px;

  border-radius: 12px;
  border: 1px solid rgb(225, 225, 225);

  margin: 0px 15px;

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

const StatsHeading = styled(Item)`
  flex: 0;
  align-self: stretch;
  color: #fff;
  top: 0px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 15px;
  text-align: center;
  padding: 10px 5px;
  right: 0;
  left: 0;
`

const StatsContent = styled(Item)`
  padding: 20px 20px;
`

const StatsPreview = styled(Span)`
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-weight: 600;
  font-size: 12px;
  opacity: 0.25;
  letter-spacing:0.1em;
  text-transform: uppercase;
  color: ${props => props.color || '#000'};
  z-index: -1;
`

const StatsInnerTitle = styled.span`
  // font-weight: bold;
  font-size: 15px;
  letter-spacing: 0.1em;
  align-items: left;
`;


const StatsInnerSub = styled.span`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  align-self: flex-end;
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


// Export Default
export default Delegate;
