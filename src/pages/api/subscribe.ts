import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'
import { stripe } from '../../services/stripe'

    type UserProps = {
        ref: {
            id: string,
        },
        data: {
            stripe_customer_id: string
        }
    }

    type SessionProps = {
        user: {
            email: string
        }
    }

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method === 'POST') {

        //fazer um cadastro do usuario dentro do stripe
        const session = await getSession({ req }) as SessionProps

        console.log(session, 'session test')

        const user = await fauna.query<UserProps>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id

        if(!customerId) {
            //criar usuário no stripe e setar o id da criação no faunadb para reutilizar os acessos
            const stripeCustomer = await stripe.customers.create({
                email: session?.user?.email || ''
            })

            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )
            customerId = stripeCustomer.id
        }
        
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1MBrzBJifmZ0b6C7Bjfxizbc', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })

    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}