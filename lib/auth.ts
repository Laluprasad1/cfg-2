export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock auth service - in real app would connect to backend
class AuthService {
  private tokenKey = 'auth_token';
  
  // Mock users
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@company.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    },
    {
      id: '2',
      username: 'user1',
      email: 'user1@company.com',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1'
    }
  ];

  async login(username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    console.log('AuthService: Attempting login for:', username);
    
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = this.mockUsers.find(u => u.username === username);
    
    if (!user || password !== 'password123') {
      console.log('AuthService: Login failed - invalid credentials');
      return { success: false, error: 'Invalid credentials' };
    }

    const token = this.generateMockToken(user);
    localStorage.setItem(this.tokenKey, token);
    
    console.log('AuthService: Login successful for user:', user.username);
    return { success: true, user, token };
  }

  async getCurrentUser(): Promise<User | null> {
    console.log('AuthService: Getting current user');
    const token = localStorage.getItem(this.tokenKey);
    
    if (!token) {
      console.log('AuthService: No token found');
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = this.mockUsers.find(u => u.id === payload.userId);
      console.log('AuthService: Current user:', user?.username);
      return user || null;
    } catch {
      console.log('AuthService: Invalid token');
      return null;
    }
  }

  logout(): void {
    console.log('AuthService: Logging out');
    localStorage.removeItem(this.tokenKey);
  }

  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      userId: user.id, 
      username: user.username,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
    const signature = btoa('mock-signature');
    
    return `${header}.${payload}.${signature}`;
  }
}

export const authService = new AuthService();