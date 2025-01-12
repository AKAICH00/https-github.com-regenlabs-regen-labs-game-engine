```markdown
# Work Plan: MongoDB Standardization and Codebase Cleanup

## Phase 1: Code Cleanup
### 1. Remove Supabase Related Code
- [x] Remove Supabase environment variables from all configuration files
- [x] Remove Supabase client initialization code
- [x] Remove Supabase dependencies from all package.json files
- [x] Remove Supabase types and interfaces
- [x] Clean up any Supabase-related documentation

### 2. MongoDB Driver Standardization
- [ ] Remove Mongoose from all dependencies
- [ ] Remove Mongoose schemas and models
- [ ] Convert all Mongoose connections to native MongoDB driver
- [ ] Update connection handling in server.js/ts files
- [ ] Standardize MongoDB client initialization

### 3. Files Requiring Updates
#### Backend
- [ ] `backend/src/server.ts`
- [ ] `backend/src/db/connection.ts`
- [ ] `backend/src/models/UserScore.ts`
- [ ] `backend/package.json`
- [ ] `backend/server.js`

#### CLI
- [ ] `cli/package.json`
- [ ] Any CLI MongoDB interactions

## Phase 2: MongoDB Implementation
### 1. Connection Management
- [ ] Implement proper connection pooling
- [ ] Add robust error handling
- [ ] Add reconnection logic
- [ ] Add graceful shutdown handling

### 2. Data Models
- [ ] Convert Mongoose schemas to MongoDB collections
- [ ] Implement type safety without Mongoose
- [ ] Create collection indexes
- [ ] Add data validation

### 3. Query Optimization
- [ ] Review and optimize existing queries
- [ ] Implement proper projection
- [ ] Add query logging for debugging
- [ ] Implement proper error handling for queries

## Phase 3: Environment Configuration
### 1. Environment Variables
- [ ] Update Doppler configuration
- [ ] Remove unused variables
- [ ] Add proper validation
- [ ] Update documentation

### 2. Required Environment Variables
```
MONGO_URI=mongodb+srv://[username]:[password]@[cluster]/[database]
BOT_TOKEN=[telegram-bot-token]
GAME_SHORT_NAME=[telegram-game-shortname]
PORT=3000 (optional)
```

## Phase 4: Testing and Validation
### 1. Test Coverage
- [ ] Update/create connection tests
- [ ] Update/create CRUD operation tests
- [ ] Update/create integration tests
- [ ] Update/create error handling tests

### 2. Performance Testing
- [ ] Test connection pooling
- [ ] Test query performance
- [ ] Test error recovery
- [ ] Test concurrent operations

## Phase 5: Documentation
### 1. Update Documentation
- [x] Update README.md
- [ ] Update API documentation
- [ ] Update deployment guides
- [ ] Create MongoDB operations guide

### 2. Create New Documentation
- [ ] MongoDB connection guide
- [ ] Error handling guide
- [ ] Query patterns guide
- [ ] Performance optimization guide

## Implementation Notes
1. **Connection Pattern**
```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI, {
  maxPoolSize: 50,
  minPoolSize: 10,
  retryWrites: true,
  w: 'majority'
});

process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});
```

2. **Collection Pattern**
```typescript
interface UserScore {
  userId: string;
  score: number;
  timestamp: Date;
}

const collection = client.db('soltap0').collection<UserScore>('scores');
```

3. **Query Pattern**
```typescript
async function getUserScore(userId: string) {
  try {
    return await collection.findOne({ userId });
  } catch (error) {
    console.error('Error fetching user score:', error);
    throw error;
  }
}
```

## Priority Order
1. Remove Mongoose dependencies
2. Implement native MongoDB driver
3. Update connection handling
4. Update data models
5. Update queries
6. Add proper error handling
7. Update tests
8. Update documentation

## Risks and Mitigations
1. **Data Migration**
   - Risk: Data loss during schema changes
   - Mitigation: Create backup before changes

2. **Performance**
   - Risk: Connection pool exhaustion
   - Mitigation: Implement proper pooling and monitoring

3. **Error Handling**
   - Risk: Unhandled MongoDB errors
   - Mitigation: Implement comprehensive error handling

4. **Type Safety**
   - Risk: Loss of Mongoose schema validation
   - Mitigation: Implement TypeScript interfaces and MongoDB schemas

## Success Criteria
1. All Mongoose code removed
2. Native MongoDB driver implemented consistently
3. All tests passing
4. No degradation in performance
5. Documentation updated
6. No Supabase references remaining
7. Clean error handling
8. Proper connection management 
```
