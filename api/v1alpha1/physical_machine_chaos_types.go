// Copyright 2020 Chaos Mesh Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// See the License for the specific language governing permissions and
// limitations under the License.

package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// PhysicMachineChaosAction represents the chaos action about DNS.
type PhysicMachineChaosAction string

const (
	// StressAction represents generates stress on the physical machine.
	StressAction PhysicMachineChaosAction = "stress"

	// NetworkAction represents inject fault into network on the physical machine.
	NetworkAction PhysicMachineChaosAction = "network"

	// DiskAction represents attack the disk on the physical machine.
	DiskAction PhysicMachineChaosAction = "disk"

	// HostAction represents attack the host.
	HostAction PhysicMachineChaosAction = "host"

	// ProcessAction represents attack the process on the physical machine.
	ProcessAction PhysicMachineChaosAction = "process"
)

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// +kubebuilder:object:root=true
// +chaos-mesh:base

// PhysicMachineChaos is the Schema for the networkchaos API
type PhysicMachineChaos struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	// Spec defines the behavior of a pod chaos experiment
	Spec PhysicMachineChaosSpec `json:"spec"`

	// +optional
	// Most recently observed status of the chaos experiment about pods
	Status PhysicMachineChaosStatus `json:"status"`
}

// PhysicMachineChaosSpec defines the desired state of PhysicMachineChaos
type PhysicMachineChaosSpec struct {
	// +kubebuilder:validation:Enum=stress;network;disk;host;process
	Action PhysicMachineChaosAction `json:"action"`

	PhysicMachineSelector `json:",inline"`

	ExpInfo string `json:"expInfo"`

	// Duration represents the duration of the chaos action
	Duration *string `json:"duration,omitempty"`
}

// PhysicMachineChaosStatus defines the observed state of PhysicMachineChaos
type PhysicMachineChaosStatus struct {
	ChaosStatus `json:",inline"`
}

func (obj *PhysicMachineChaos) GetSelectorSpecs() map[string]interface{} {
	return map[string]interface{}{
		".": &obj.Spec.PhysicMachineSelector,
	}
}

type PhysicMachineSelector struct {
	Address string `json:"address"`
}

func (selector *PhysicMachineSelector) Id() string {
	return selector.Address
}
