import { Route } from 'react-router-dom';
import { ErrorTrackingRoutes } from '@dapps-frontend/error-tracking';
import { OnLogin, InfoText } from 'components';
import { AddMinter } from './addminter';
import { CreateNft } from './create';
import { ImageList } from './cardlist';
import { Home } from './home';
import { NFT } from './nft';
import { Ticket } from './ticket';
import { GameBox } from './game';

const routes = [
  { path: '/', Page: Home },
  { path: 'nft/:id', Page: NFT },
  { path: 'card_list', Page: ImageList, isPrivate: true },
  { path: 'create', Page: CreateNft, isPrivate: true },
  { path: 'addminter', Page: AddMinter, isPrivate: true },
  { path: 'mint_ticket', Page: Ticket, isPrivate: true },
  { path: 'playpage', Page: GameBox, isPrivate: true },
];

function Routing() {
  const getRoutes = () =>
    routes.map(({ path, Page, isPrivate }) => (
      <Route
        key={path}
        path={path}
        element={
          isPrivate ? (
            <OnLogin fallback={<InfoText text="In order to use all features, please login" />}>
              <Page />
            </OnLogin>
          ) : (
            <Page />
          )
        }
      />
    ));

  return <ErrorTrackingRoutes>{getRoutes()}</ErrorTrackingRoutes>;
}

export { Routing };
