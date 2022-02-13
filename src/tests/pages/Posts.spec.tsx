import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Post, { getStaticProps } from "../../pages/posts";
import { stripe } from "../../services/stripes";
import { getPrismicClient } from '../../services/prismic'

const posts = [
  {
    slug: 'my-new-post',
    title: 'My new Post',
    excerpt: 'Post excerpt',
    updatedAt: '10 de Abril',
  }
]

jest.mock('../../services/prismic')

describe("Posts Page", () => {
  it("renders correctly", () => {
    render(<Post posts={posts} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'My new Post',
            data: {
              title: [
                {type: 'heading', text: 'My new post'}
              ],
              content: [
                {
                  type: 'paragraph', text: 'Post excerpt'
                }
              ]
            },
            last_publication_date: '04-01-2021'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'My new Post',
            title: 'My new post',
            excerpt: 'Post excerpt',
            updatedAt: '01 de abril de 2021'
          }],
        },
      })
    );
  });
});
