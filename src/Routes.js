import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";

import Signup from "./auth/Signup";
import PlayerRoute from "./routes/PlayerRoute";
import AdminRoute from "./routes/AdminRoute";
import Dashboard from "./dashboard/pages/Dashboard";
import Activate from "./auth/Activate";
import Ranking from "./ranking/pages/Ranking";
import AdminProfile from "./profile/admin/pages/Profile";
import PlayerProfile from "./profile/player/pages/Profile";
import Forgot from "./auth/Forgot";
import Login from "./auth/Login";
import Reset from "./auth/Reset";

import UnauthorisedAccess from "./auth/unauthorised-access";
import NotFound from "./auth/404";

import ProfileAdminView from "./profile/player/pages/ProfileAdminView";
import PlayerProfileList from "./profile/player/pages/List";
import CreatePlayerProfile from "./profile/player/pages/Create";
import CreateAdminProfile from "./profile/admin/pages/Create";
import UpdatePlayerProfile from "./profile/player/pages/Update";
import UpdateAdminProfile from "./profile/admin/pages/Update";

import SponsorList from "./sponsor/pages/List";
import CreateSponsor from "./sponsor/pages/Create";
import UpdateSponsor from "./sponsor/pages/Update";
import SponsorProfile from "./sponsor/pages/Profile";

import CreateSponsorPayment from "./sponsorPayment/pages/Create";
import UpdateSponsorPayment from "./sponsorPayment/pages/Update";
import ViewSponsorPayment from "./sponsorPayment/pages/View";

import ListUser from "./user/pages/List";
import UpdateUser from "./user/pages/Update";

import CreateTeam from "./team/pages/Create";
import UpdateTeam from "./team/pages/Update";
import ProfileTeam from "./team/pages/Profile";
import ListTeam from "./team/pages/List";
import DeleteTeam from "./team/pages/Delete";

import CreateTournament from "./tournament/pages/Create";
import UpdateTournament from "./tournament/pages/Update";
import ProfileTournament from "./tournament/pages/Profile";
import ListTournament from "./tournament/pages/List";
import DeleteTournament from "./tournament/pages/Delete";

import CreateMatch from "./match/pages/Create";
import UpdateMatch from "./match/pages/Update";
import ViewMatch from "./match/pages/View";
import ListMatch from "./match/pages/List";
import DeleteMatch from "./match/pages/Delete";

import CreateMatchDetail from "./matchDetail/pages/Create";
import UpdateMatchDetail from "./matchDetail/pages/Update";
import ViewMatchDetail from "./matchDetail/pages/View";
import ListMatchDetail from "./matchDetail/pages/List";
import AddMatchDetails from "./matchDetail/pages/AddMatchDetails";
import EditMatchDetails from "./matchDetail/pages/EditMatchDetails";

import ViewExpense from "./expense/pages/View";
import CreateExpense from "./expense/pages/Create";
import UpdateExpense from "./expense/pages/Update";
import ListExpense from "./expense/pages/List";
import DeleteExpense from "./expense/pages/Delete";

import Reporting from "./reporting/pages/Reporting";

import ViewPlayerPayment from "./playerPayment/pages/View";
import CreatePlayerPayment from "./playerPayment/pages/Create";
import UpdatePlayerPayment from "./playerPayment/pages/Update";
import ListPlayerPayment from "./playerPayment/pages/List";
import DeletePlayerPayment from "./playerPayment/pages/Delete";

import ViewSquad from "./squad/pages/View";
import CreateSquad from "./squad/pages/Create";
import UpdateSquad from "./squad/pages/Update";
import ListSquad from "./squad/pages/List";
import DeleteSquad from "./squad/pages/Delete";

import ViewRegistration from "./registration/pages/View";
import UpdateRegistration from "./registration/pages/Update";
import ListRegistration from "./registration/pages/Registration";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/* Authenticated route */}
        <Route path="/signup" exact component={Signup} />
        <Route path="/login" exact component={Login} />
        <Route path="/auth/password/forgot" exact component={Forgot} />
        <Route path="/auth/password/reset/:token" exact component={Reset} />
        <Route path="/auth/activate/:token" exact component={Activate} />
        <Route
          path="/unauthorised-access"
          exact
          component={UnauthorisedAccess}
        />

        {/* Unathenticated route */}
        <Route path="/" exact component={App} />
        <AdminRoute path="/dashboard" exact component={Dashboard} />
        <Route path="/ranking" exact component={Ranking} />

        {/* Player route */}
        <PlayerRoute path="/player/profile" exact component={PlayerProfile} />
        <AdminRoute
          path="/admin/player/list"
          exact
          component={PlayerProfileList}
        />
        <PlayerRoute
          path="/player/profile/create"
          exact
          component={CreatePlayerProfile}
        />
        <PlayerRoute
          path="/player/profile/update"
          exact
          component={UpdatePlayerProfile}
        />

        {/* Admin route */}
        <AdminRoute path="/admin/profile" exact component={AdminProfile} />
        <AdminRoute
          path="/admin/player/profile-admin-view/:id"
          exact
          component={ProfileAdminView}
        />
        <AdminRoute
          path="/admin/profile/create"
          exact
          component={CreateAdminProfile}
        />
        <AdminRoute
          path="/admin/profile/update"
          exact
          component={UpdateAdminProfile}
        />
        {/* Sponsor routes */}
        <AdminRoute
          path="/admin/sponsor/profile/:id"
          exact
          component={SponsorProfile}
        />
        <AdminRoute path="/admin/sponsor/list" exact component={SponsorList} />
        <AdminRoute
          path="/admin/sponsor/create/"
          exact
          component={CreateSponsor}
        />
        <AdminRoute
          path="/admin/sponsor/update/:id"
          exact
          component={UpdateSponsor}
        />
        {/* Sponsor payment routes */}
        <AdminRoute
          path="/admin/sponsor-payment/create/:id"
          exact
          component={CreateSponsorPayment}
        />
        <AdminRoute
          path="/admin/sponsor-payment/update/:id"
          exact
          component={UpdateSponsorPayment}
        />
        <AdminRoute
          path="/admin/sponsor-payment/read/:id"
          exact
          component={ViewSponsorPayment}
        />
        {/* User route */}
        <AdminRoute path="/admin/user/update" exact component={UpdateUser} />
        <PlayerRoute path="/player/user/update" exact component={UpdateUser} />
        <AdminRoute path="/admin/user/list" exact component={ListUser} />

        {/* Team route */}
        <AdminRoute path="/admin/team/create" exact component={CreateTeam} />
        <AdminRoute
          path="/admin/team/profile/:id"
          exact
          component={ProfileTeam}
        />
        <AdminRoute
          path="/admin/team/update/:id"
          exact
          component={UpdateTeam}
        />
        <AdminRoute path="/admin/team/list" exact component={ListTeam} />
        <AdminRoute
          path="/admin/team/delete/:id"
          exact
          component={DeleteTeam}
        />
        {/* Tournament route */}
        <AdminRoute
          path="/admin/tournament/create"
          exact
          component={CreateTournament}
        />
        <AdminRoute
          path="/admin/tournament/profile/:id"
          exact
          component={ProfileTournament}
        />
        <AdminRoute
          path="/admin/tournament/update/:id"
          exact
          component={UpdateTournament}
        />
        <AdminRoute
          path="/admin/tournament/list"
          exact
          component={ListTournament}
        />
        <AdminRoute
          path="/admin/tournament/delete/:id"
          exact
          component={DeleteTournament}
        />

        {/* Match route */}
        <AdminRoute path="/admin/match/create" exact component={CreateMatch} />
        <AdminRoute path="/admin/match/read/:id" exact component={ViewMatch} />
        <AdminRoute
          path="/admin/match/update/:id"
          exact
          component={UpdateMatch}
        />
        <AdminRoute path="/admin/match/list" exact component={ListMatch} />
        <AdminRoute
          path="/admin/match/delete/:id"
          exact
          component={DeleteMatch}
        />

        {/* MatchDetail route */}
        <AdminRoute
          path="/admin/match-detail/create/:id"
          exact
          component={CreateMatchDetail}
        />
        <AdminRoute
          path="/admin/match-detail/read/:id"
          exact
          component={ViewMatchDetail}
        />
        <AdminRoute
          path="/admin/match-detail/update/:id"
          exact
          component={UpdateMatchDetail}
        />
        <AdminRoute
          path="/admin/match-detail/list"
          exact
          component={ListMatchDetail}
        />
        <AdminRoute
          path="/admin/match-detail/add-details/:p_id,:m_id"
          exact
          component={AddMatchDetails}
        />
        <AdminRoute
          path="/admin/match-detail/edit-details/:p_id,:m_id"
          exact
          component={EditMatchDetails}
        />

        {/* Expense route */}
        <AdminRoute
          path="/admin/expense/create"
          exact
          component={CreateExpense}
        />
        <AdminRoute
          path="/admin/expense/read/:id"
          exact
          component={ViewExpense}
        />
        <AdminRoute
          path="/admin/expense/update/:id"
          exact
          component={UpdateExpense}
        />
        <AdminRoute path="/admin/expense/list" exact component={ListExpense} />
        <AdminRoute
          path="/admin/expense/delete/:id"
          exact
          component={DeleteExpense}
        />

        {/* Squad route */}
        <AdminRoute
          path="/admin/squad/create/:id"
          exact
          component={CreateSquad}
        />
        <AdminRoute path="/admin/squad/read/:id" exact component={ViewSquad} />
        <AdminRoute
          path="/admin/squad/update/:id"
          exact
          component={UpdateSquad}
        />
        <AdminRoute path="/admin/squad/list" exact component={ListSquad} />
        <AdminRoute
          path="/admin/squad/delete/:id"
          exact
          component={DeleteSquad}
        />

        {/* Player payment route */}
        <AdminRoute
          path="/admin/player-payment/create/:id"
          exact
          component={CreatePlayerPayment}
        />
        <AdminRoute
          path="/admin/player-payment/read/:id"
          exact
          component={ViewPlayerPayment}
        />
        <PlayerRoute
          path="/player/player-payment/read/:id"
          exact
          component={ViewPlayerPayment}
        />
        <AdminRoute
          path="/admin/player-payment/update/:id"
          exact
          component={UpdatePlayerPayment}
        />
        <AdminRoute
          path="/admin/player-payment/list"
          exact
          component={ListPlayerPayment}
        />
        <AdminRoute
          path="/admin/player-payment/delete/:id"
          exact
          component={DeletePlayerPayment}
        />

        {/* Registration route */}
        <AdminRoute
          path="/admin/registration/read/:id"
          exact
          component={ViewRegistration}
        />
        <AdminRoute
          path="/admin/registration/update/:id"
          exact
          component={UpdateRegistration}
        />
        <AdminRoute
          path="/admin/registration/list"
          exact
          component={ListRegistration}
        />

        {/* Reporting route */}
        <AdminRoute
          path="/admin/reporting/reporting"
          exact
          component={Reporting}
        />

        {/* 404 route */}
        <Route path="/" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
