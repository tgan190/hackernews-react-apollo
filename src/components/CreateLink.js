import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

//   _createLink = async () => {
//     const { description, url } = this.state;
//     console.log('this.props: ');
//     await this.props.postMutation({
//       variables: {
//         description,
//         url
//       }
//     })
//   }

// xxx_createLink = async () => {
    // console.log('this.props: ');
  //   const { description, url } = this.state;
  //   await this.props.postMutation({
  //     variables: {
  //       description,
  //       url,
  //     },
  //     update: (store, { data: { post } }) => {
  //       const data = store.readQuery({ query: FEED_QUERY })
  //       data.feed.links.splice(0, 0, post)
  //       store.writeQuery({
  //         query: FEED_QUERY,
  //         data,
  //       })
  //     },
  //   })
  //   this.props.history.push('/')
  // }

  xxx_createLink = async () => {
    const { description, url } = this.state
    await this.props.postMutation({
      variables: {
        description,
        url,
      },
      /* update: (store, { data: { post } }) => {
        console.log('createLink: post',post)
        const first = LINKS_PER_PAGE
        const skip = 0
        const orderBy = 'createdAt_DESC'
        const data = store.readQuery({
          query: FEED_QUERY,
          variables: { first, skip, orderBy },
        })
        console.log('createLink: data',data)
        // here it makes no difference as are redirecting to page 1 after update.
        // But if we stay on this page, the following 2 lines would be necessary
        // But if we redirect to any new page, a  fresh query would be triggered.
        //The query that is bound to the component

        data.feed.links.splice(0, 0, post)
        data.feed.links.pop()
        console.log ('Not update cache in createLink')
        store.writeQuery({
          query: FEED_QUERY,
          data,
          variables: { first, skip, orderBy },
        })
      }, */
    })
    this.props.history.push(`/new/1`)
  }

  render() {
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={this.state.url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={(e) => this.xxx_createLink()}>Submit</button>
      </div>
    )
  }

  _createLink = async () => {
    // ... you'll implement this in a bit
  }
}

// 1
const POST_MUTATION = gql`
  # 2
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

// 3
export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateLink)