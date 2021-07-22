import React from "react";
import styled, { css } from 'styled-components';
import {Section, Content, Item, ItemH, ItemBreak, A, B, H1, H2, H3, Image, P, Span, Anchor, Button, Showoff, FormSubmision, Input, TextField} from 'components/SharedStyling';
import Loader from 'react-loader-spinner'
import { Waypoint } from "react-waypoint";
import { BsChevronExpand } from 'react-icons/bs';

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

  const [controlAt, setControlAt] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [owner, setOwner] = React.useState(null);
  const [delegateesObject, setDelegateesObject] = React.useState({});
  const [showAnswers, setShowAnswers] = React.useState([]);

  const toggleShowAnswer = (id) => {
    let newShowAnswers = [...showAnswers];
    newShowAnswers[id] = !newShowAnswers[id];

    setShowAnswers(newShowAnswers);
  }

  React.useEffect(() => {
    setDelegateesObject(delegateesJSON)
    setLoading(false);
  }, [account]);

  // handle user action at control center
  const userClickedAt = (controlIndex) => {
    setControlAt(controlIndex);
  }

  return (
    <>
    <Section align="center">
      <H2 textTransform="uppercase" spacing="0.1em">
        <Span bg="#e20880" color="#fff" weight="600" padding="0px 8px">Delegate</Span><Span weight="200"> to PUSHers</Span>
      </H2> 
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
                  epnsReadProvider={epnsReadProvider}
                  epnsWriteProvide={epnsWriteProvide}
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
                    How can I keep up with EPNS Governance?
                  </Span>
                  <BsChevronExpand size={20} color={"#ddd"}/>
                </Question>

                {showAnswers[4] &&
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
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(273deg, #674c9f 0%, rgba(226,8,128,1) 100%);
  `

// Export Default
export default Delegate;
