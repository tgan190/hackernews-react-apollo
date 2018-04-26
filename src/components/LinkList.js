import React, { Component } from 'react'
import Link from './Link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { LINKS_PER_PAGE } from '../constants'

class LinkList extends Component {

    xxx_updateCacheAfterVote = (store, createVote, linkId) => {
      // const isNewPage = this.props.location.pathname.includes('new')
      // const page = parseInt(this.props.match.params.page, 10)
      // const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
      // const first = isNewPage ? LINKS_PER_PAGE : 100
      // const orderBy = isNewPage ? 'createdAt_DESC' : null
      // const data = store.readQuery({ query: FEED_QUERY, variables: { first, skip, orderBy } })
    
      // const votedLink = data.feed.links.find(link => link.id === linkId)
      // votedLink.votes = createVote.link.votes
      
      // console.log('data from store query', data)
      // console.log('votedLink before', votedLink)
      // votedLink.description = "Congratulations - from updateCacheAfterVote"
      // console.log('votedLink after', votedLink)
      // console.log('votedLink.description after', votedLink.description)
      // console.log('updated data',data)
      // store.writeQuery({ query: FEED_QUERY, data })
      console.log('Do nothing for update cache after vote')
    }

    xxx_subscribeToNewLinks = () => {
      this.props.feedQuery.subscribeToMore({
        document: gql`
          subscription {
            newLink {
              node {
                id
                url
                description
                createdAt
                postedBy {
                  id
                  name
                }
                votes {
                  id
                  user {
                    id
                  }
                }
              }
            }
          }
        `,
         updateQuery: (previous, { subscriptionData }) => {
           console.log('newLink subscriptionData', subscriptionData)
           console.log('previous',previous)
          // const newAllLinks = [subscriptionData.data.newLink.node, ...previous.feed.links]
          const newAllLinks = [subscriptionData.data.newLink.node,...previous.feed.links]
          const newCount = previous.feed.count + 1
          // const result = {
          //   ...previous,
          //   feed: {
          //     links: newAllLinks
          //   },
          // }
          const result = {
           
            // ...previous, ...previous.feed, feed: {links: newAllLinks, __typename: "Feed"}
            ...previous, feed: {links: newAllLinks, __typename: "Feed", count: newCount}
              // feed: {links: newAllLinks}            
          }
          console.log('updated result from newLink subscription', result)
          return result
        }, 
      })
    }

   
    xxx_subscribeToNewVotes = () => {
      this.props.feedQuery.subscribeToMore({
        document: gql`
          subscription {
            newVote {
              node {
                id
                link {
                  id
                  url
                  description
                  createdAt
                  postedBy {
                    id
                    name
                  }
                  votes {
                    id
                    user {
                      id
                    }
                  }
                }
                user {
                  id
                }
              }
            }
          }
        `,
      })
    }

    componentDidMount() {
      this.xxx_subscribeToNewLinks()
      this.xxx_subscribeToNewVotes()
    }

    xxx_getLinksToRender = (isNewPage) => {
      console.log('this.props.feedQuery in xxx_getLinksToRender', this.props.feedQuery)
      if (isNewPage) {
        return this.props.feedQuery.feed.links
      }
      const rankedLinks = this.props.feedQuery.feed.links.slice()
      rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
      return rankedLinks
    }

    xxx_nextPage = () => {
      const page = parseInt(this.props.match.params.page, 10)
      if (page <= this.props.feedQuery.feed.count / LINKS_PER_PAGE) {
        const nextPage = page + 1
        this.props.history.push(`/new/${nextPage}`)
      }
    }
    
    xxx_previousPage = () => {
      const page = parseInt(this.props.match.params.page, 10)
      if (page > 1) {
        const previousPage = page - 1
        this.props.history.push(`/new/${previousPage}`)
      }
    }


    render() {

        if (this.props.feedQuery && this.props.feedQuery.loading) {
          return <div>Loading</div>
        }
      
        if (this.props.feedQuery && this.props.feedQuery.error) {
          return <div>Error</div>
        }
      
        const isNewPage = this.props.location.pathname.includes('new')
        // const linksToRender = this.props.feedQuery.feed.links
        const linksToRender = this.xxx_getLinksToRender(isNewPage)
       // const page = parseInt(this.props.match.params.page, 10)
        console.log('this.props.feedQuery in LinkList : ',this.props.feedQuery)
        console.log('this.props',this.props)

        return (
          <div>
            <div>
              {linksToRender.map((link, index) => (
                <Link
                  key={link.id}
                  updateStoreAfterVote={this.xxx_updateCacheAfterVote}
                  index={index}
                  link={link}
                />
              ))}
            </div>
            {isNewPage &&
            <div className='flex ml4 mv3 gray'>
              <div className='pointer mr2' onClick={() => this.xxx_previousPage()}>Previous</div>
              <div className='pointer' onClick={() => this.xxx_nextPage()}>Next</div>
            </div>
            }
          </div>
        )
      
    }
 
}

// 1
export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      count
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`

// 3
// export default graphql(FEED_QUERY, { name: 'feedQuery' }) (LinkList)
export default graphql(FEED_QUERY, {
  name: 'feedQuery',
  options: ownProps => {
    const page = parseInt(ownProps.match.params.page, 10)
    const isNewPage = ownProps.location.pathname.includes('new')
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return {
      variables: { first, skip, orderBy },
    }
  },
})(LinkList)