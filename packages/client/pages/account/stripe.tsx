import React, { useEffect, useState } from "react";
import { AccountViewParent } from "../../components/views/account/account-view-parent/AccountViewParent";
import ProfilePicture from "../../components/views/account/ProfilePicture";
import NProgress from "nprogress";
import getAxios from "../../util/AxiosInstance";
import getBaseURL from "../../util/urlUtil";
import { useRouter } from "next/router";
import useToast from "../../util/hooks/useToast";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/user";
import Button from "../../components/ui/Button";
import { setToken } from "../../util/TokenManager";
export default function Stripe() {

     const [user, setUser] = useRecoilState(userState);

    const [account, setAccount] = useState<any>();

    const router = useRouter();

    const toast = useToast();


    

    const connectStripe = () => {
        NProgress.start();
        getAxios()
          .post(`/checkout/stripe/setup/create`, { baseurl: getBaseURL(router) })
          .then((res) => {
            NProgress.done();
            router.push(res.data.payload.accountLink.url);
          })
          .catch((err) => {
            NProgress.done();
            console.log(err.response.data);
            toast("Something went wrong...");
          });
      };


      useEffect(() => {
        getAxios()
          .get("/checkout/stripe/setup/verify")
          .then((res) => {
            if (res.data.payload.account!!.charges_enabled) {
              setAccount("Payments are enabled.");
            } else {
              setAccount("Payments DISABLED, reconnect stripe.");
            }
          })
          .catch((err) => {
            setAccount(err.response.data.error);
          });
      }, [user]);
      
    const getStripeIntegration = () => {
        if (account === undefined) {
          return <p>Loading stripe account info...</p>;
        } else {
          return (
            <>
              <p>Stripe Integration:</p>
              <p>{account}</p>
            </>
          );
        }
      };

    return (
        <AccountViewParent content={() => 
        <>  
            <h1>Stripe Integration</h1>
            {getStripeIntegration()}
            <p>You can hit setup stripe even if payments are enabled, if you need to completely change your seller information.</p>
            <div>
            
                <Button onClick={connectStripe}>Setup Stripe</Button>
            </div>   

        </>}
        />
    );
}


