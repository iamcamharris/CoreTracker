import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ChampionshipTracker = () => {
  const [currentView, setCurrentView] = useState('today');
  const [entries, setEntries] = useState([]);
  const [todayEntry, setTodayEntry] = useState(null);
  const [coreValues, setCoreValues] = useState('');
  const [declarations, setDeclarations] = useState('');
  const [responses, setResponses] = useState('');
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ type: 'custom', name: '', current: 0, target: 0 });

  const INITIAL_VALUES = `MY NEW IDENTITY (WHO I AM PRACTICING BEING)

I am a grounded, sovereign man who stays present under pressure.
Not because I am unbothered — but because I am embodied.

I no longer earn safety by disappearing.
I no longer confuse endurance with love.
I no longer perform calm while abandoning myself.

I lead myself first.

My worth does not rise or fall based on whether I am chosen, understood, or agreed with.

I can hold responsibility without carrying what is not mine.

---

CORE VALUES (THE STANDARDS I LIVE BY)

These are not aspirations — they are behavioral anchors.

1. INTEGRITY
I tell the truth cleanly, even when it's uncomfortable.
I do not distort facts to protect peace.

2. PRESENCE
I stay in my body during conflict.
I do not dissociate, explain, or appease to escape discomfort.

3. RESPONSIBILITY (Not Self-Erasure)
I own my actions and their impact.
I do not absorb blame to maintain connection.

4. EMOTIONAL REGULATION
I respond, not react.
My nervous system sets the pace, not fear.

5. DIGNITY
I remain intact even when misunderstood.
I do not disappear to be loved.`;

  const INITIAL_DECLARATIONS = `DECLARATIONS (INTERNAL COMMANDS)

Use these when your system activates.

• I can be misunderstood and still be whole.

• I do not need to explain myself to be safe.

• Accountability does not require self-punishment.

• I choose presence over performance.

• I lead myself even when I am not chosen.

• I can feel fear without obeying it.

• I no longer abandon myself to preserve connection.

---

MY NEW INTERNAL CONTRACT

"I no longer abandon myself to preserve connection."

I choose:
• Presence over peacekeeping
• Truth over approval
• Regulation over reassurance
• Integrity over outcome

---

FINAL ANCHOR (COME BACK TO THIS)

I am not becoming colder.
I am becoming less negotiable.

And the grief I feel is not loss of self —
it is the return of it.`;

  const INITIAL_RESPONSES = `GROUNDED RESPONSES (WHAT I SAY UNDER PRESSURE)

Use ONE SENTENCE ONLY. Say it once. Then stop.

---

PERSPECTIVE
"From my perspective, my intention was ___, and I can see how the impact landed differently."

---

ACCOUNTABILITY
"I take responsibility for my actions here, even though my internal experience was different."

---

VALIDATION WITHOUT AGREEMENT
"I understand how that would feel hurtful from your perspective."

---

CORRECTION WITHOUT DEFENSE
"For clarity, the fact is ___."

---

BOUNDARY WITH PRESENCE
"I'm willing to talk about this, and I need to do it without over-explaining."

---

REMINDER: If I feel the urge to keep talking — pause. 
That urge is old safety trying to regain control.

---

HOW I KNOW I AM INTEGRATED (CHECKPOINTS)

After hard conversations or therapy sessions:
• My body feels calm, not hollow
• I'm not replaying or rehearsing
• I don't feel the urge to fix perceptions
• I trust myself even without agreement
• I feel sad or disappointed without collapsing

That is regulation.
That is leadership.
That is growth.`;

  const POINT_SYSTEM = {
    spiritual: [
      { id: 'bibleStudy', label: 'Bible Study (15 min)', points: 6 },
      { id: 'prayer', label: 'Prayer & Gratitude', points: 4 }
    ],
    physical: [
      { id: 'workout', label: 'Workout (30 min)', points: 5 },
      { id: 'sleep', label: '7.5+ Hours Sleep', points: 3 },
      { id: 'nutrition', label: 'Green Drink or Clean Eating', points: 2 }
    ],
    mental: [
      { id: 'meditation', label: 'Meditation (10 min)', points: 3 },
      { id: 'journal', label: 'Journal (10 min)', points: 2 },
      { id: 'planning', label: 'Evening Planning', points: 3 },
      { id: 'deepWork', label: 'Deep Work or Learning', points: 2 }
    ],
    emotional: [
      { id: 'decompression', label: 'Decompression Time', points: 2 },
      { id: 'familyTime', label: 'Quality Family Time', points: 5 }
    ],
    financial: [
      { id: 'financialReview', label: 'Financial Review', points: 3 },
      { id: 'businessWork', label: 'Business Activity', points: 5 },
      { id: 'budget', label: 'Stayed On Budget', points: 2 }
    ]
  };

  const PILLAR_INFO = {
    spiritual: { name: 'SPIRITUAL', color: '#3B82F6' },
    physical: { name: 'PHYSICAL', color: '#10B981' },
    mental: { name: 'MENTAL', color: '#0EA5E9' },
    emotional: { name: 'EMOTIONAL', color: '#F59E0B' },
    financial: { name: 'FINANCIAL', color: '#8B5CF6' }
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const entriesResult = await window.storage.get('championship-entries-v2');
      if (entriesResult && entriesResult.value) {
        const parsedEntries = JSON.parse(entriesResult.value);
        setEntries(parsedEntries);
        
        const todayStr = getTodayString();
        const today = parsedEntries.find(e => e.date === todayStr);
        setTodayEntry(today || createEmptyEntry());
      } else {
        setTodayEntry(createEmptyEntry());
      }

      const valuesResult = await window.storage.get('core-values');
      setCoreValues(valuesResult && valuesResult.value ? valuesResult.value : INITIAL_VALUES);

      const declarationsResult = await window.storage.get('declarations');
      setDeclarations(declarationsResult && declarationsResult.value ? declarationsResult.value : INITIAL_DECLARATIONS);

      const responsesResult = await window.storage.get('responses');
      setResponses(responsesResult && responsesResult.value ? responsesResult.value : INITIAL_RESPONSES);

      const goalsResult = await window.storage.get('goals');
      if (goalsResult && goalsResult.value) {
        setGoals(JSON.parse(goalsResult.value));
      }
    } catch (error) {
      setTodayEntry(createEmptyEntry());
      setCoreValues(INITIAL_VALUES);
      setDeclarations(INITIAL_DECLARATIONS);
      setResponses(INITIAL_RESPONSES);
    }
    setLoading(false);
  };

  const createEmptyEntry = () => {
    const entry = { date: getTodayString(), lostCoolCount: 0, notes: '' };
    Object.values(POINT_SYSTEM).forEach(pillar => {
      pillar.forEach(activity => { entry[activity.id] = false; });
    });
    return entry;
  };

  const calculatePillarScore = (pillar, entry) => {
    let score = 0;
    POINT_SYSTEM[pillar].forEach(activity => { if (entry[activity.id]) score += activity.points; });
    if (pillar === 'emotional') {
      const lostCool = entry.lostCoolCount || 0;
      if (lostCool === 0) score += 3;
      else if (lostCool === 1) score += 1;
    }
    return score;
  };

  const calculateOverallScore = (entry) => {
    const pillars = ['spiritual', 'physical', 'mental', 'emotional', 'financial'];
    const total = pillars.reduce((sum, pillar) => sum + calculatePillarScore(pillar, entry), 0);
    return (total / 5).toFixed(1);
  };

  const saveEntry = async (entry) => {
    const updatedEntries = [...entries.filter(e => e.date !== entry.date), entry].sort((a, b) => new Date(b.date) - new Date(a.date));
    setEntries(updatedEntries);
    setTodayEntry(entry);
    try {
      await window.storage.set('championship-entries-v2', JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const updateTodayEntry = (field, value) => {
    const updated = { ...todayEntry, [field]: value };
    setTodayEntry(updated);
  };

  const saveToday = () => {
    saveEntry(todayEntry);
    const score = parseFloat(calculateOverallScore(todayEntry));
    alert(score >= 8.0 ? 'CHAMPIONSHIP DAY - Score: ' + score : 'Progress Saved - Score: ' + score);
  };

  const saveContent = async (key, value, message) => {
    try {
      await window.storage.set(key, value);
      alert(message);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const saveGoals = async (updatedGoals) => {
    try {
      await window.storage.set('goals', JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const addGoal = () => {
    if (!newGoal.name) {
      alert('Please enter a goal name');
      return;
    }
    const goal = {
      id: Date.now(),
      ...newGoal,
      current: parseFloat(newGoal.current) || 0,
      target: parseFloat(newGoal.target) || 0,
      completed: false
    };
    const updatedGoals = [...goals, goal];
    saveGoals(updatedGoals);
    setNewGoal({ type: 'custom', name: '', current: 0, target: 0 });
    setShowAddGoal(false);
  };

  const updateGoal = (id, field, value) => {
    const updatedGoals = goals.map(g => g.id === id ? { ...g, [field]: value } : g);
    saveGoals(updatedGoals);
  };

  const deleteGoal = (id) => {
    if (confirm('Delete this goal?')) {
      const updatedGoals = goals.filter(g => g.id !== id);
      saveGoals(updatedGoals);
    }
  };

  const calculateStats = () => {
    if (entries.length === 0) return null;
    const last7Days = entries.slice(0, 7);
    const last30Days = entries.slice(0, 30);
    return {
      currentStreak: calculateStreak(),
      weekAvgOverall: (last7Days.reduce((sum, e) => sum + parseFloat(calculateOverallScore(e)), 0) / last7Days.length).toFixed(1),
      monthAvgOverall: (last30Days.reduce((sum, e) => sum + parseFloat(calculateOverallScore(e)), 0) / last30Days.length).toFixed(1),
      totalDays: entries.length,
      weekLostCool: last7Days.reduce((sum, e) => sum + (e.lostCoolCount || 0), 0),
      perfectDays: entries.filter(e => parseFloat(calculateOverallScore(e)) === 10.0).length
    };
  };

  const calculateStreak = () => {
    let streak = 0;
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (let i = 0; i < sortedEntries.length; i++) {
      if (parseFloat(calculateOverallScore(sortedEntries[i])) >= 8.0) streak++;
      else break;
    }
    return streak;
  };

  const getTrendData = () => {
    return entries.slice(0, 14).reverse().map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      overall: parseFloat(calculateOverallScore(entry)),
      spiritual: calculatePillarScore('spiritual', entry),
      physical: calculatePillarScore('physical', entry),
      mental: calculatePillarScore('mental', entry),
      emotional: calculatePillarScore('emotional', entry),
      financial: calculatePillarScore('financial', entry)
    }));
  };

  const getRadarData = () => {
    const last7Days = entries.slice(0, 7);
    if (last7Days.length === 0) return [];
    return Object.keys(PILLAR_INFO).map(key => ({
      pillar: PILLAR_INFO[key].name,
      score: (last7Days.reduce((sum, e) => sum + calculatePillarScore(key, e), 0) / last7Days.length).toFixed(1)
    }));
  };

  const stats = calculateStats();

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #0F172A; }
  `;

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Rajdhani, sans-serif', background: '#0F172A', minHeight: '100vh', color: '#F8FAFC' }}>
        <style>{globalStyles}</style>
        <h2>LOADING...</h2>
      </div>
    );
  }

  const renderContent = () => {
    // GOALS VIEW
    if (currentView === 'goals') {
      return (
        <>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '36px', fontWeight: '900', color: '#F8FAFC', fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>GOALS</h1>
            <p style={{ margin: '0', fontSize: '16px', color: '#94A3B8', fontWeight: '500' }}>Track progress across all areas of life</p>
          </div>

          <button 
            onClick={() => setShowAddGoal(!showAddGoal)}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}
          >
            {showAddGoal ? 'CANCEL' : '+ ADD NEW GOAL'}
          </button>

          {showAddGoal && (
            <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#F8FAFC', letterSpacing: '2px', textTransform: 'uppercase' }}>NEW GOAL</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#94A3B8', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Goal Type</label>
                <select 
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', fontSize: '15px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '500', background: '#1E293B', color: '#F8FAFC' }}
                >
                  <option value="custom">Custom (Checkbox)</option>
                  <option value="money">Money / Savings</option>
                  <option value="book">Book Reading</option>
                  <option value="weight">Weight / Muscle</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#94A3B8', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Goal Name</label>
                <input 
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder={newGoal.type === 'money' ? 'Emergency Fund' : newGoal.type === 'book' ? 'Atomic Habits' : newGoal.type === 'weight' ? 'Body Composition' : 'Goal name'}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', fontSize: '15px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '500', background: '#1E293B', color: '#F8FAFC' }}
                />
              </div>

              {newGoal.type !== 'custom' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#94A3B8', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {newGoal.type === 'money' ? 'Current Amount' : newGoal.type === 'book' ? 'Pages Read' : 'Current Weight/Muscle'}
                      </label>
                      <input 
                        type="number"
                        value={newGoal.current}
                        onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', fontSize: '15px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '500', background: '#1E293B', color: '#F8FAFC' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#94A3B8', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {newGoal.type === 'money' ? 'Target Amount' : newGoal.type === 'book' ? 'Total Pages' : 'Target Weight/Muscle'}
                      </label>
                      <input 
                        type="number"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', fontSize: '15px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '500', background: '#1E293B', color: '#F8FAFC' }}
                      />
                    </div>
                  </div>
                </>
              )}

              <button 
                onClick={addGoal}
                style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '900', cursor: 'pointer', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Orbitron, sans-serif' }}
              >
                ADD GOAL
              </button>
            </div>
          )}

          {goals.length === 0 ? (
            <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '60px', borderRadius: '16px', textAlign: 'center', border: '1px solid #334155' }}>
              <h2 style={{ color: '#F8FAFC', fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>NO GOALS YET</h2>
              <p style={{ color: '#94A3B8' }}>Add your first goal to start tracking progress</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {goals.map(goal => (
                <div key={goal.id} style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        {goal.type === 'money' ? 'MONEY' : goal.type === 'book' ? 'BOOK' : goal.type === 'weight' ? 'WEIGHT/MUSCLE' : 'CUSTOM'}
                      </div>
                      <h3 style={{ margin: '0', fontSize: '20px', fontWeight: '700', color: '#F8FAFC' }}>{goal.name}</h3>
                    </div>
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      style={{ padding: '8px 16px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px' }}
                    >
                      DELETE
                    </button>
                  </div>

                  {goal.type === 'custom' ? (
                    <div 
                      style={{ display: 'flex', alignItems: 'center', padding: '16px', background: goal.completed ? 'rgba(14, 165, 233, 0.1)' : '#1E293B', borderRadius: '8px', cursor: 'pointer', border: goal.completed ? '1px solid #0EA5E9' : '1px solid #334155' }} 
                      onClick={() => updateGoal(goal.id, 'completed', !goal.completed)}
                    >
                      <div style={{ width: '24px', height: '24px', borderRadius: '4px', border: `2px solid ${goal.completed ? '#0EA5E9' : '#475569'}`, background: goal.completed ? '#0EA5E9' : 'transparent', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '16px' }}>
                        {goal.completed && '✓'}
                      </div>
                      <span style={{ fontSize: '15px', fontWeight: goal.completed ? '700' : '500', color: goal.completed ? '#F8FAFC' : '#94A3B8', flex: 1 }}>
                        {goal.completed ? 'COMPLETED' : 'Mark as Complete'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>Progress</span>
                          <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                            {((goal.current / goal.target) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '12px', backgroundColor: '#1E293B', borderRadius: '6px', overflow: 'hidden', border: '1px solid #334155' }}>
                          <div style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #0EA5E9, #3B82F6)', transition: 'width 0.3s ease' }}></div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Current</label>
                          <input 
                            type="number"
                            value={goal.current}
                            onChange={(e) => updateGoal(goal.id, 'current', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', fontSize: '16px', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', background: '#1E293B', color: '#0EA5E9', textAlign: 'center' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Target</label>
                          <input 
                            type="number"
                            value={goal.target}
                            onChange={(e) => updateGoal(goal.id, 'target', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', fontSize: '16px', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', background: '#1E293B', color: '#F8FAFC', textAlign: 'center' }}
                          />
                        </div>
                      </div>

                      {goal.type === 'money' && (
                        <div style={{ marginTop: '12px', padding: '12px', background: '#1E293B', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', textAlign: 'center', fontWeight: '600' }}>
                          Remaining: ${(goal.target - goal.current).toLocaleString()}
                        </div>
                      )}

                      {goal.type === 'book' && (
                        <div style={{ marginTop: '12px', padding: '12px', background: '#1E293B', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', textAlign: 'center', fontWeight: '600' }}>
                          {goal.target - goal.current} pages remaining
                        </div>
                      )}

                      {goal.type === 'weight' && (
                        <div style={{ marginTop: '12px', padding: '12px', background: '#1E293B', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', textAlign: 'center', fontWeight: '600' }}>
                          {goal.current > goal.target ? 'Lose' : 'Gain'}: {Math.abs(goal.target - goal.current).toFixed(1)} lbs
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      );
    }

    // VALUES VIEW
    if (currentView === 'values') {
      return (
        <ContentPage
          title="CORE VALUES"
          subtitle="The foundation of who I am"
          content={coreValues}
          setContent={setCoreValues}
          editMode={editMode}
          setEditMode={setEditMode}
          onSave={() => saveContent('core-values', coreValues, 'Core Values Saved')}
          accentColor="#3B82F6"
        />
      );
    }

    // DECLARATIONS VIEW
    if (currentView === 'declarations') {
      return (
        <ContentPage
          title="DECLARATIONS"
          subtitle="Internal commands - who I am becoming"
          content={declarations}
          setContent={setDeclarations}
          editMode={editMode}
          setEditMode={setEditMode}
          onSave={() => saveContent('declarations', declarations, 'Declarations Saved')}
          accentColor="#10B981"
        />
      );
    }

    // RESPONSES VIEW
    if (currentView === 'responses') {
      return (
        <ContentPage
          title="GROUNDED RESPONSES"
          subtitle="What I say under pressure - pre-planned responses"
          content={responses}
          setContent={setResponses}
          editMode={editMode}
          setEditMode={setEditMode}
          onSave={() => saveContent('responses', responses, 'Responses Saved')}
          accentColor="#F59E0B"
        />
      );
    }

    // TODAY VIEW
    if (currentView === 'today') {
      const spiritualScore = calculatePillarScore('spiritual', todayEntry);
      const physicalScore = calculatePillarScore('physical', todayEntry);
      const mentalScore = calculatePillarScore('mental', todayEntry);
      const emotionalScore = calculatePillarScore('emotional', todayEntry);
      const financialScore = calculatePillarScore('financial', todayEntry);
      const overallScore = parseFloat(calculateOverallScore(todayEntry));

      return (
        <>
          <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '32px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center', border: '1px solid #334155', position: 'relative' }}>
            <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '12px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>Overall Score</div>
            <div style={{ fontSize: '72px', fontWeight: '900', fontFamily: 'Orbitron, sans-serif', background: overallScore >= 8.0 ? 'linear-gradient(135deg, #10B981, #059669)' : overallScore >= 6.0 ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #EF4444, #DC2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1' }}>
              {overallScore}
            </div>
            <div style={{ fontSize: '14px', color: '#94A3B8', marginTop: '12px', fontWeight: '600', letterSpacing: '1px' }}>
              {overallScore >= 8.0 ? 'CHAMPIONSHIP LEVEL' : overallScore >= 6.0 ? 'KEEP PUSHING' : 'LEVEL UP REQUIRED'}
            </div>
          </div>

          <PillarCard title="SPIRITUAL STRENGTH" color={PILLAR_INFO.spiritual.color} score={spiritualScore} activities={POINT_SYSTEM.spiritual} entry={todayEntry} updateEntry={updateTodayEntry} />
          <PillarCard title="PHYSICAL STEWARDSHIP" color={PILLAR_INFO.physical.color} score={physicalScore} activities={POINT_SYSTEM.physical} entry={todayEntry} updateEntry={updateTodayEntry} />
          <PillarCard title="MENTAL DISCIPLINE" color={PILLAR_INFO.mental.color} score={mentalScore} activities={POINT_SYSTEM.mental} entry={todayEntry} updateEntry={updateTodayEntry} />

          <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '24px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: PILLAR_INFO.emotional.color, letterSpacing: '2px', textTransform: 'uppercase' }}>EMOTIONAL MASTERY</h3>
              <div style={{ fontSize: '28px', fontWeight: '900', color: PILLAR_INFO.emotional.color, fontFamily: 'Orbitron, sans-serif' }}>
                {emotionalScore}<span style={{ fontSize: '16px', color: '#64748B' }}>/10</span>
              </div>
            </div>
            <ProgressBar score={emotionalScore} maxScore={10} color={PILLAR_INFO.emotional.color} />
            {POINT_SYSTEM.emotional.map(activity => (
              <ActivityCheckbox key={activity.id} label={activity.label} points={activity.points} checked={todayEntry[activity.id]} onChange={(val) => updateTodayEntry(activity.id, val)} color={PILLAR_INFO.emotional.color} />
            ))}
            <div style={{ marginTop: '20px', padding: '20px', background: '#1E293B', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC', letterSpacing: '1px', textTransform: 'uppercase' }}>Composure</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>
                  {todayEntry.lostCoolCount === 0 && '+3 PTS'}
                  {todayEntry.lostCoolCount === 1 && '+1 PT'}
                  {todayEntry.lostCoolCount >= 2 && '0 PTS'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button onClick={() => updateTodayEntry('lostCoolCount', Math.max(0, todayEntry.lostCoolCount - 1))} style={{ flex: 1, padding: '12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '24px', fontWeight: '900', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif' }}>-</button>
                <div style={{ flex: 1, textAlign: 'center', fontSize: '48px', fontWeight: '900', color: todayEntry.lostCoolCount === 0 ? '#10B981' : '#EF4444', fontFamily: 'Orbitron, sans-serif' }}>{todayEntry.lostCoolCount}</div>
                <button onClick={() => updateTodayEntry('lostCoolCount', todayEntry.lostCoolCount + 1)} style={{ flex: 1, padding: '12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '24px', fontWeight: '900', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif' }}>+</button>
              </div>
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748B', marginTop: '12px', fontWeight: '600' }}>LOST COOL COUNT</div>
            </div>
          </div>

          <PillarCard title="FINANCIAL STEWARDSHIP" color={PILLAR_INFO.financial.color} score={financialScore} activities={POINT_SYSTEM.financial} entry={todayEntry} updateEntry={updateTodayEntry} />

          <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '24px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#F8FAFC', letterSpacing: '2px', textTransform: 'uppercase' }}>FIELD NOTES</h3>
            <textarea value={todayEntry.notes} onChange={(e) => updateTodayEntry('notes', e.target.value)} placeholder="Wins, lessons, reflections..." style={{ width: '100%', minHeight: '100px', padding: '16px', borderRadius: '8px', border: '1px solid #334155', fontSize: '15px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '500', background: '#1E293B', color: '#F8FAFC', resize: 'vertical' }} />
          </div>

          <button onClick={saveToday} style={{ width: '100%', padding: '20px', background: overallScore >= 8.0 ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #0EA5E9, #3B82F6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Orbitron, sans-serif', marginBottom: '24px' }}>SAVE PROGRESS</button>
        </>
      );
    }

    // DASHBOARD VIEW
    if (currentView === 'dashboard') {
      return (
        <>
          {stats ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <StatCard title="CURRENT STREAK" value={stats.currentStreak} subtitle="Championship Days" color="#0EA5E9" />
                <StatCard title="WEEK AVG" value={stats.weekAvgOverall} subtitle="Score" color="#3B82F6" />
                <StatCard title="MONTH AVG" value={stats.monthAvgOverall} subtitle="Score" color="#10B981" />
                <StatCard title="PERFECT DAYS" value={stats.perfectDays} subtitle="10.0 Scores" color="#F59E0B" />
                <StatCard title="COMPOSURE" value={stats.weekLostCool === 0 ? 'PERFECT' : stats.weekLostCool} subtitle="Lost Cool This Week" color={stats.weekLostCool === 0 ? '#10B981' : '#EF4444'} />
                <StatCard title="TOTAL DAYS" value={stats.totalDays} subtitle="Tracked" color="#8B5CF6" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <ChartCard title="PILLAR BALANCE">
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={getRadarData()}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="pillar" tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis domain={[0, 10]} tick={{ fill: '#64748B', fontSize: 11 }} />
                      <Radar name="Score" dataKey="score" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.5} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="14 DAY TREND">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={getTrendData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                      <YAxis domain={[0, 10]} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }} />
                      <Line type="monotone" dataKey="overall" stroke="#0EA5E9" strokeWidth={3} dot={{ fill: '#0EA5E9', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </>
          ) : (
            <EmptyState onStart={() => setCurrentView('today')} />
          )}
        </>
      );
    }

    // HISTORY VIEW
    if (currentView === 'history') {
      return entries.length === 0 ? <EmptyState message="NO HISTORY" onStart={() => setCurrentView('today')} /> : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {entries.map(entry => {
            const overallScore = parseFloat(calculateOverallScore(entry));
            return (
              <div key={entry.date} style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ margin: '0', color: '#F8FAFC', fontSize: '16px', fontWeight: '600' }}>
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  <div style={{ fontSize: '36px', fontWeight: '900', fontFamily: 'Orbitron, sans-serif', background: overallScore >= 8.0 ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #F59E0B, #D97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {overallScore}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '12px' }}>
                  {Object.keys(PILLAR_INFO).map(key => (
                    <div key={key} style={{ textAlign: 'center', padding: '12px', background: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
                      <div style={{ fontSize: '20px', fontWeight: '900', color: PILLAR_INFO[key].color, fontFamily: 'Orbitron, sans-serif' }}>{calculatePillarScore(key, entry)}</div>
                      <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px', fontWeight: '600', letterSpacing: '1px' }}>{PILLAR_INFO[key].name}</div>
                    </div>
                  ))}
                </div>
                {entry.lostCoolCount > 0 && (
                  <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', borderRadius: '6px', fontSize: '12px', color: '#EF4444', marginBottom: '10px', fontWeight: '600' }}>
                    LOST COOL: {entry.lostCoolCount} TIME{entry.lostCoolCount > 1 ? 'S' : ''}
                  </div>
                )}
                {entry.notes && (
                  <div style={{ padding: '12px', background: '#1E293B', borderRadius: '8px', fontSize: '14px', color: '#94A3B8', fontWeight: '500', border: '1px solid #334155' }}>
                    {entry.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'Rajdhani, sans-serif', background: '#0F172A', minHeight: '100vh' }}>
      <style>{globalStyles}</style>
      
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? '280px' : '80px', background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)', borderRight: '1px solid #334155', transition: 'width 0.3s', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {sidebarOpen && (
              <div>
                <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '900', color: '#F8FAFC', fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>CORE</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B', fontWeight: '600' }}>TRACKER</p>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: '8px', background: 'transparent', border: '1px solid #334155', borderRadius: '6px', color: '#94A3B8', cursor: 'pointer', fontSize: '18px', lineHeight: '1' }}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
          {sidebarOpen && stats && stats.currentStreak > 0 && (
            <div style={{ marginTop: '16px', padding: '8px 12px', background: 'rgba(14, 165, 233, 0.2)', border: '1px solid #0EA5E9', borderRadius: '6px', fontSize: '12px', fontWeight: '700', color: '#0EA5E9', letterSpacing: '1px', textAlign: 'center' }}>
              {stats.currentStreak} DAY STREAK
            </div>
          )}
        </div>

        <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
          <SidebarButton label="TODAY" active={currentView === 'today'} onClick={() => setCurrentView('today')} collapsed={!sidebarOpen} />
          <SidebarButton label="DASHBOARD" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} collapsed={!sidebarOpen} />
          <SidebarButton label="HISTORY" active={currentView === 'history'} onClick={() => setCurrentView('history')} collapsed={!sidebarOpen} />
          <SidebarButton label="GOALS" active={currentView === 'goals'} onClick={() => setCurrentView('goals')} collapsed={!sidebarOpen} color="#8B5CF6" />
          
          <div style={{ margin: '24px 0 12px 0', padding: '0 12px', fontSize: '11px', color: '#475569', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {sidebarOpen ? 'PHOENIX PROTOCOL' : '—'}
          </div>
          
          <SidebarButton label="VALUES" active={currentView === 'values'} onClick={() => setCurrentView('values')} collapsed={!sidebarOpen} color="#3B82F6" />
          <SidebarButton label="DECLARATIONS" active={currentView === 'declarations'} onClick={() => setCurrentView('declarations')} collapsed={!sidebarOpen} color="#10B981" />
          <SidebarButton label="RESPONSES" active={currentView === 'responses'} onClick={() => setCurrentView('responses')} collapsed={!sidebarOpen} color="#F59E0B" />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', overflow: 'auto', maxWidth: sidebarOpen ? 'calc(100vw - 280px)' : 'calc(100vw - 80px)' }}>
        <div style={{ maxWidth: currentView === 'dashboard' ? '1400px' : '900px', margin: '0 auto' }}>
          {currentView !== 'values' && currentView !== 'declarations' && currentView !== 'responses' && currentView !== 'goals' && (
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '36px', fontWeight: '900', color: '#F8FAFC', fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>
                {currentView === 'today' ? 'TODAY' : currentView === 'dashboard' ? 'DASHBOARD' : 'HISTORY'}
              </h1>
              <p style={{ margin: '0', fontSize: '16px', color: '#94A3B8', fontWeight: '500' }}>
                {currentView === 'today' ? new Date(todayEntry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 
                 currentView === 'dashboard' ? 'Performance Analytics' : 'All Tracked Days'}
              </p>
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const SidebarButton = ({ label, active, onClick, collapsed, color }) => (
  <button onClick={onClick} style={{ 
    width: '100%', 
    padding: collapsed ? '16px 0' : '16px', 
    background: active ? (color ? `rgba(${color === '#3B82F6' ? '59, 130, 246' : color === '#10B981' ? '16, 185, 129' : color === '#F59E0B' ? '245, 158, 11' : '139, 92, 246'}, 0.2)` : 'rgba(14, 165, 233, 0.2)') : 'transparent', 
    color: active ? (color || '#0EA5E9') : '#94A3B8', 
    border: active ? `1px solid ${color || '#0EA5E9'}` : '1px solid transparent', 
    borderRadius: '10px', 
    fontSize: '14px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    letterSpacing: '1px', 
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    transition: 'all 0.2s'
  }}>
    {collapsed ? label.charAt(0) : label}
  </button>
);

const ContentPage = ({ title, subtitle, content, setContent, editMode, setEditMode, onSave, accentColor }) => (
  <>
    <div style={{ marginBottom: '32px' }}>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '36px', fontWeight: '900', color: '#F8FAFC', fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>
        {title}
      </h1>
      <p style={{ margin: '0', fontSize: '16px', color: '#94A3B8', fontWeight: '500' }}>{subtitle}</p>
    </div>
    <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '32px', borderRadius: '16px', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={() => setEditMode(!editMode)} style={{ padding: '10px 20px', background: editMode ? '#64748B' : `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`, color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {editMode ? 'CANCEL' : 'EDIT'}
        </button>
      </div>
      {editMode ? (
        <>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} style={{ width: '100%', minHeight: '500px', padding: '20px', borderRadius: '8px', border: '1px solid #334155', fontSize: '15px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '500', background: '#1E293B', color: '#F8FAFC', resize: 'vertical', lineHeight: '1.8' }} />
          <button onClick={onSave} style={{ width: '100%', marginTop: '16px', padding: '16px', background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '900', cursor: 'pointer', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Orbitron, sans-serif' }}>
            SAVE
          </button>
        </>
      ) : (
        <div style={{ padding: '20px', background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', minHeight: '400px', whiteSpace: 'pre-wrap', fontSize: '16px', lineHeight: '2', color: '#E2E8F0', fontWeight: '500' }}>
          {content}
        </div>
      )}
    </div>
  </>
);

const PillarCard = ({ title, color, score, activities, entry, updateEntry }) => (
  <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '24px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #334155' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color, letterSpacing: '2px', textTransform: 'uppercase' }}>{title}</h3>
      <div style={{ fontSize: '28px', fontWeight: '900', color, fontFamily: 'Orbitron, sans-serif' }}>{score}<span style={{ fontSize: '16px', color: '#64748B' }}>/10</span></div>
    </div>
    <ProgressBar score={score} maxScore={10} color={color} />
    {activities.map(activity => <ActivityCheckbox key={activity.id} label={activity.label} points={activity.points} checked={entry[activity.id]} onChange={(val) => updateEntry(activity.id, val)} color={color} />)}
  </div>
);

const ActivityCheckbox = ({ label, points, checked, onChange, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: checked ? 'rgba(14, 165, 233, 0.1)' : '#1E293B', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer', border: checked ? `1px solid ${color}` : '1px solid #334155' }} onClick={() => onChange(!checked)}>
    <div style={{ width: '24px', height: '24px', borderRadius: '4px', border: `2px solid ${checked ? color : '#475569'}`, background: checked ? color : 'transparent', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '16px' }}>{checked && '✓'}</div>
    <span style={{ fontSize: '15px', fontWeight: checked ? '700' : '500', color: checked ? '#F8FAFC' : '#94A3B8', flex: 1 }}>{label}</span>
    <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>+{points}</span>
  </div>
);

const ProgressBar = ({ score, maxScore, color }) => {
  const percentage = (score / maxScore) * 100;
  return <div style={{ width: '100%', height: '8px', backgroundColor: '#1E293B', borderRadius: '4px', marginBottom: '20px', overflow: 'hidden', border: '1px solid #334155' }}><div style={{ width: `${percentage}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}dd)`, transition: 'width 0.3s ease' }}></div></div>;
};

const StatCard = ({ title, value, subtitle, color }) => (
  <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center', border: '1px solid #334155' }}>
    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{title}</div>
    <div style={{ fontSize: '40px', fontWeight: '900', color, fontFamily: 'Orbitron, sans-serif', lineHeight: '1' }}>{value}</div>
    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px', fontWeight: '600' }}>{subtitle}</div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#F8FAFC', letterSpacing: '2px', textTransform: 'uppercase' }}>{title}</h3>
    {children}
  </div>
);

const EmptyState = ({ message = "NO DATA YET", onStart }) => (
  <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '60px', borderRadius: '16px', textAlign: 'center', border: '1px solid #334155' }}>
    <h2 style={{ color: '#F8FAFC', fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>{message}</h2>
    <p style={{ color: '#94A3B8', marginBottom: '24px' }}>Start tracking to see your analytics</p>
    <button onClick={onStart} style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}>START TODAY</button>
  </div>
);

export default ChampionshipTracker;
