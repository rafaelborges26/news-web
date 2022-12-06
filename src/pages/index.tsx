import { GetServerSideProps, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image';
import styles from './home.module.scss';
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

interface HomeProps {
  product: {
    price_id: string
    amount: string
  }
}

export default function Home({ product } : HomeProps) {
  console.log(product)
  return (
    <>
      <Head>Home | ig.news</Head>
      <main className={styles.contentContainer} >
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>Wews about the <span>React</span> world.</h1>
          <p>Get access to all the publications <br/>
          <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.price_id} />
        </section>
        <Image src="/images/avatar.svg" alt="Girl coding" width={400} height={400} />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1MBrzBJifmZ0b6C7Bjfxizbc', {
    expand: ['product'] //para conseguir pegar as informações do produto e não só o preço
  })

  const product = {
    priceId: price.id,
     amount: price.unit_amount && new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
     }
     ).format(price.unit_amount / 100)
  }

  console.log(price.product, 'mostra o produto')

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
    //apos esse tempo um novo conteudo da página vai ser gerado novamente, se mil pessoas acessarem dentro de 1 minuto, a página vai ser mostrada igualmente para todos os 1000
  }
}
