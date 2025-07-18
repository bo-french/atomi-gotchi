import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import { useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-purple-600">🐾 Virtual Pet Email Game</h2>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-purple-600 mb-4">🐾 Virtual Pet Email Game</h1>
        <Authenticated>
          <p className="text-xl text-gray-600">
            Welcome back, {loggedInUser?.email ?? "friend"}!
          </p>
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-gray-600">Sign in to start caring for your virtual pet</p>
        </Unauthenticated>
      </div>

      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <GameDashboard />
      </Authenticated>
    </div>
  );
}

function GameDashboard() {
  const pet = useQuery(api.pets.getCurrentPet);
  const actions = useQuery(api.pets.getPetActions, { limit: 5 });
  const createPet = useMutation(api.pets.createPet);
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("cat");

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim()) {
      toast.error("Please enter a name for your pet");
      return;
    }
    
    try {
      await createPet({ name: petName.trim(), species: petSpecies });
      toast.success("Your virtual pet has been created! Check your email for updates.");
      setPetName("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create pet");
    }
  };

  if (pet === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Create Your Virtual Pet</h2>
          <p className="text-gray-600 text-center mb-8">
            Your virtual pet will live in your email inbox! You'll receive regular status updates 
            and can reply with simple commands to take care of them.
          </p>
          
          <form onSubmit={handleCreatePet} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Name
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                placeholder="Enter your pet's name"
                maxLength={20}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Species
              </label>
              <select
                value={petSpecies}
                onChange={(e) => setPetSpecies(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              >
                <option value="cat">🐱 Cat (Balanced)</option>
                <option value="dog">🐶 Dog (High Energy)</option>
                <option value="dragon">🐉 Dragon (High Maintenance)</option>
                <option value="rabbit">🐰 Rabbit (Fast Metabolism)</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Create Pet
            </button>
          </form>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You'll receive email updates about your pet's status</li>
              <li>• Reply with commands: <strong>feed</strong>, <strong>play</strong>, <strong>sleep</strong>, <strong>medicine</strong></li>
              <li>• Keep your pet happy, fed, and healthy to help them grow</li>
              <li>• Neglected pets may get sick or even pass away</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const moodEmoji = {
    happy: "😊",
    sad: "😢", 
    tired: "😴",
    sick: "🤒",
    excited: "🤩",
    hungry: "😋",
    dead: "💀"
  };

  const getStatusColor = (value: number) => {
    if (value > 70) return "text-green-600";
    if (value > 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBar = (value: number) => {
    const percentage = Math.max(0, Math.min(100, value));
    return (
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-300 ${
            percentage > 70 ? 'bg-green-500' : 
            percentage > 40 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Pet Status */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">
            {moodEmoji[pet.mood as keyof typeof moodEmoji]} {pet.name}
          </h2>
          <p className="text-gray-600">
            Level {pet.level} {pet.species} • {Math.floor(pet.age)} hours old
          </p>
          <p className="text-lg font-semibold capitalize text-purple-600">
            Mood: {pet.mood}
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">🍖 Hunger</span>
              <span className={`text-sm font-bold ${getStatusColor(pet.hunger)}`}>
                {Math.round(pet.hunger)}%
              </span>
            </div>
            {getStatusBar(pet.hunger)}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">😊 Happiness</span>
              <span className={`text-sm font-bold ${getStatusColor(pet.happiness)}`}>
                {Math.round(pet.happiness)}%
              </span>
            </div>
            {getStatusBar(pet.happiness)}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">⚡ Energy</span>
              <span className={`text-sm font-bold ${getStatusColor(pet.energy)}`}>
                {Math.round(pet.energy)}%
              </span>
            </div>
            {getStatusBar(pet.energy)}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">❤️ Health</span>
              <span className={`text-sm font-bold ${getStatusColor(pet.health)}`}>
                {Math.round(pet.health)}%
              </span>
            </div>
            {getStatusBar(pet.health)}
          </div>
        </div>
        
        {!pet.isAlive && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-800 font-semibold">💀 {pet.name} has passed away</p>
            <p className="text-red-600 text-sm mt-1">
              You can create a new pet to start over.
            </p>
          </div>
        )}
      </div>
      
      {/* Game Info & Recent Actions */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📧 Email Commands</h3>
          <p className="text-gray-600 mb-4">
            Reply to status emails with these commands:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl mb-1">🍖</div>
              <div className="font-semibold">feed</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-2xl mb-1">🎾</div>
              <div className="font-semibold">play</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl mb-1">😴</div>
              <div className="font-semibold">sleep</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <div className="text-2xl mb-1">💊</div>
              <div className="font-semibold">medicine</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📜 Recent Actions</h3>
          {actions && actions.length > 0 ? (
            <div className="space-y-3">
              {actions.map((action) => (
                <div key={action._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold capitalize">{action.action}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      action.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {action.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{action.result}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(action.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No actions yet. Check your email for status updates!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
