import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { BuilderComponent, builder, useIsPreviewing, Builder } from '@builder.io/react'
import '@builder.io/widgets';
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import builderConfig from '@config/builder'


builder.init(builderConfig.apiKey)

export async function getStaticProps({ 
    params 
}: GetStaticPropsContext<{ slug: string[] }>) {
   const articleData =  
    (await builder
        .get('article',{
        query:{
            'data.slug': params?.slug
        }
     }).toPromise()) || null;

 const articleTemplate = await builder
    .get('blog', {
        options: {
            enrich: true,
        },
    }).toPromise();

//console.log("articleTemplate ", articleData);

  return {
    props: {
        articleData,
        articleTemplate,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
    const articles = await builder.getAll('article', {
      options: {noTargeting: true},
      omit: 'data.blocks'
    })
  
    articles.map(article => console.log(`/blog/${article.data?.slug}`),)
    
    return {
      paths : articles.map(article => `/blog/${article.data?.slug}`),
      fallback: true,
    };
  }

  export default function Page({
    articleTemplate ,
    articleData
   }:InferGetStaticPropsType<typeof getStaticProps>) {
 const router = useRouter();
 if (router.isFallback) {
   return <h1>Loading...</h1>;
 }
 const isLive = !Builder.isEditing && !Builder.isPreviewing;

 if (!articleData && isLive) {
   return (
     <>
       <Head>
         <meta name="robots" content="noindex" />
         <meta name="title"></meta>
       </Head>
       <DefaultErrorPage statusCode={404} />
     </>
   );
 }

 return (
    <>
     <Head>
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       {!articleData && <meta name='robots' content='noindex'/>}
     </Head>
      <BuilderComponent model="blog" 
               content={articleTemplate} 
               data={{article: articleData?.data}} 
       />
   </>
 );
}