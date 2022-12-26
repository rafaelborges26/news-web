import { fauna } from "../../../services/fauna"
import {query as q} from 'faunadb'
import { stripe } from "../../../services/stripe"

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false
) {
    //buscar o usuário no banco do FaundaDB com o Id customerId, pra isso precisaremos criar um indice para fazer a busca pelo campo de customerId

    console.log(subscriptionId, customerId, 'chegou os dados')

    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerId
                    )
                )
            )
        )

    console.log(userRef, 'userRef')

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }

    if(createAction) {
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                { data: subscriptionData }
            )
        )
    } else {
        console.log('caiu no else')
        await fauna.query(
            q.Replace(
                 q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                            subscriptionId,
                        )
                    )
                 ),
                 { data: subscriptionData }
            )
        )
    }

    //salvar os dados da subscription do usuario no faunaDB
    console.log(subscriptionId, customerId, 'arrived')
}