import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { BuilderComponent, builder, useIsPreviewing, BuilderContent } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import '@builder.io/widgets/dist/lib/builder-widgets-async';
import builderConfig from '@config/builder';

builder.init(builderConfig.apiKey);

const locale = "en-US";

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await builder.getAll('article', {
    options: { noTargeting: true },
    fields: 'data.slug',
  });

  const paths = articles.map((article: any) => ({
    params: { slug: article.data?.slug },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  const cityData = await builder
    .get('article', {
      query: {
        'data.slug': slug
      },
      locale,
      options: {
        enrich: true
      }
    })
    .toPromise();

  const cityTemplate = await builder
    .get('city-pass', {
      userAttributes: {
        urlPath: `/city-pass/${slug}`,
      },
      options: {
        enrich: true
      },
      locale,
    })
    .toPromise();

    console.log("cityData", cityData.data?.myReference?.value.data.title );

  return {
    props: {
      cityData: cityData || null,
      cityTemplate: cityTemplate || null,
    },
    revalidate: 60,
  };
};

export default function Page({ 
  cityData, 
  cityTemplate 
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const isPreviewingInBuilder = useIsPreviewing();
  const show404 = !cityData && !isPreviewingInBuilder;
  const useDataVisualPreview = (isPreviewingInBuilder && builder?.editingModel === "article");

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if (show404) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <>
      {!cityData && <meta name="robots" content="noindex" />}
      {useDataVisualPreview ? (
        <BuilderContent model="article" content={cityData}>
          {(article: any) => (
            <BuilderComponent model="city-pass" locale={locale} content={cityTemplate} data={{article}}  />
          )}
        </BuilderContent>
      ) : (
        <BuilderComponent model="city-pass" locale={locale} content={cityTemplate} data={{article: cityData?.data}}/>
      )}
    </>
  );
}