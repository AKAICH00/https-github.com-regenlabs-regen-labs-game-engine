import { GameSDK } from '../src';
import { execSync } from 'child_process';

async function getSecret(name: string): Promise<string> {
  return execSync(`doppler secrets get ${name} --project regen-labs --config prd --plain`, 
    { stdio: 'pipe' }).toString().trim();
}

async function testSDK() {
  console.log('🎮 Starting SDK test...\n');

  try {
    // Get credentials from Doppler
    console.log('📦 Getting credentials from Doppler...');
    const botToken = await getSecret('BOT_TOKEN');
    const gameShortName = await getSecret('GAME_SHORT_NAME');

    console.log('✓ Credentials retrieved');

    // Initialize SDK
    console.log('\n🔧 Initializing SDK...');
    const sdk = new GameSDK({
      botToken,
      gameShortName
    });

    // Test user setup
    console.log('\n👤 Setting up test user...');
    sdk.setUser({
      id: "6399305910",  // Your actual Telegram user ID from the logs
      username: "test_user",
      firstName: "Test",
      lastName: "User"
    });

    const user = sdk.getUser();
    console.log('✓ User set:', user);

    // Test score submission
    console.log('\n🎯 Testing score submission...');
    const score = 150;  // Higher score to test update
    console.log(`Submitting score: ${score}`);
    
    const result = await sdk.submitScore(score);
    console.log('Score submission:', result ? '✅ Success' : '❌ Failed');
    
    // Check high score
    const highScore = sdk.getHighScore();
    console.log('Current high score:', highScore);

    console.log('\n✨ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testSDK();
