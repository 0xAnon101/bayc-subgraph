# bayc-subgraph
The BAYC NFT collection , subgraph for one to query against

Query against: https://thegraph.com/hosted-service/subgraph/gautamraju15/bayc-indexer?selected=playground 

There are two entities that you can query: *BoredApeToken* and *BoredApeUser*
Schema is available in the above link.

## A sample query 

```
{
  boredApeTokens(first: 5) {
    id
    tokenID
    contentURI
    imageURI
    createdAtTimestamp
    
    eyes
    background
    clothes
    
    owner {
      id 
      tokens {
        tokenID
      } 
    }
  }
}
```
