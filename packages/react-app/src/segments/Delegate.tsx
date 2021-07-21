import React from "react";
import styled, { css } from 'styled-components';
import {Section, Content, Item, ItemH, ItemBreak, A, B, H1, H2, H3, Image, P, Span, Anchor, Button, Showoff, FormSubmision, Input, TextField} from 'components/SharedStyling';
import Loader from 'react-loader-spinner'
import { Waypoint } from "react-waypoint";

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
function ViewDelegatees({ epnsReadProvider, epnsWriteProvide }) {
  const { account, library } = useWeb3React();

  const [controlAt, setControlAt] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [owner, setOwner] = React.useState(null);
  const [delegateesObject, setDelegateesObject] = React.useState({});

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

// Export Default
export default ViewDelegatees;
